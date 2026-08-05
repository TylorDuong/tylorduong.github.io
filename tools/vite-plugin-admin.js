// Local content admin API, mounted on the existing Vite dev server.
//
// `apply: 'serve'` means this plugin is never registered during `vite build`,
// so none of it can reach production. It is also loopback-only and requires a
// custom header, because it writes files and can shell out to a deploy.

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { ENTITIES, validate } from "./content-schema.js";

const API = "/__admin/api";
const MAX_UPLOAD = 8 * 1024 * 1024;
const BACKUPS_KEPT = 20;

// Paths whose changes belong to "the site" — used both for the dirty-tree
// warning and for the optional commit during publish. Deliberately explicit
// rather than `git add -A`, so unrelated local work is never swept in.
const SOURCE_PATHS = ["content", "public", "src", "tools", "vite.config.js"];

// png/jpeg/webp only. SVG is deliberately excluded: it is script-capable, and
// nothing here needs vector art.
const IMAGE_TYPES = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

const UPLOAD_DIRS = new Map([
  ["projects", "public/projects"],
  ["avatars", "public/avatars"],
]);

/* ------------------------------------------------------------- utilities */

const json = (res, code, body) => {
  res.statusCode = code;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
};

const isLoopback = (req) => {
  const a = req.socket?.remoteAddress || "";
  return a === "127.0.0.1" || a === "::1" || a === "::ffff:127.0.0.1";
};

/**
 * Guard against writing outside the repo. Uses path.relative rather than a
 * string-prefix check, which is unreliable on Windows (drive-letter case,
 * mixed separators).
 */
function assertInside(root, target) {
  const rel = path.relative(root, target);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`refusing to touch path outside the project: ${target}`);
  }
  return target;
}

function readBody(req, limit = MAX_UPLOAD) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("payload too large"), { code: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/**
 * Replace a file atomically, keeping a rolling backup. Writes a temp file in
 * the same directory then renames over the target — on the same volume that
 * is atomic, so a crash mid-write can never leave truncated JSON that would
 * break both the dev server and the build.
 */
function writeFileAtomic(root, target, contents) {
  assertInside(root, target);
  const dir = path.dirname(target);
  fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(target)) {
    const backupDir = path.join(root, "content", ".backups");
    fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(target, path.join(backupDir, `${path.basename(target)}-${stamp}`));

    const kept = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith(path.basename(target)))
      .sort()
      .reverse();
    for (const stale of kept.slice(BACKUPS_KEPT)) {
      fs.rmSync(path.join(backupDir, stale), { force: true });
    }
  }

  const tmp = path.join(dir, `.${path.basename(target)}.tmp-${process.pid}-${Date.now()}`);
  fs.writeFileSync(tmp, contents);
  fs.renameSync(tmp, target);
}

function run(cmd, args, cwd) {
  return new Promise((resolve) => {
    // argv array + shell:false — no string is ever handed to a shell.
    const child = spawn(cmd, args, { cwd, shell: false });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out: out.trim() }));
    child.on("error", (e) => resolve({ code: -1, out: String(e) }));
  });
}

const npmCmd = () => (process.platform === "win32" ? "npm.cmd" : "npm");

/* ------------------------------------------------------------- the plugin */

export function adminPlugin() {
  let root = process.cwd();

  // Frozen table: request input NEVER becomes part of a path.
  let contentPaths = null;
  const pathFor = (entity) => {
    if (!contentPaths) {
      contentPaths = Object.freeze(
        Object.fromEntries(ENTITIES.map((e) => [e, path.join(root, "content", `${e}.json`)]))
      );
    }
    return Object.prototype.hasOwnProperty.call(contentPaths, entity) ? contentPaths[entity] : null;
  };

  const readEntity = (entity) => {
    const file = pathFor(entity);
    const raw = fs.readFileSync(file, "utf8");
    return { doc: JSON.parse(raw), mtimeMs: fs.statSync(file).mtimeMs };
  };

  // Single-flight publish state, streamed to the UI over SSE.
  const publish = { running: false, log: [], clients: new Set(), startedAt: null, result: null };

  const emit = (line) => {
    publish.log.push(line);
    for (const res of publish.clients) {
      res.write(`data: ${JSON.stringify({ line })}\n\n`);
    }
  };

  return {
    name: "portfolio-admin",
    apply: "serve", // never present in a production build

    configureServer(server) {
      root = server.config.root;

      server.middlewares.use(API, async (req, res, next) => {
        // Belt and braces: this plugin should not exist in a prod context.
        if (process.env.NODE_ENV === "production") return next();

        if (!isLoopback(req)) {
          return json(res, 403, { error: "admin API is loopback-only" });
        }

        const url = new URL(req.url, "http://localhost");
        const route = url.pathname.replace(/\/+$/, "") || "/";
        const method = req.method || "GET";

        // Any state-changing call must carry the custom header (defeats
        // simple-request CSRF) and come from a localhost origin (defeats
        // DNS rebinding). Both are cheap and neither breaks the local UI.
        if (method !== "GET") {
          if (req.headers["x-admin"] !== "1") {
            return json(res, 403, { error: "missing x-admin header" });
          }
          const origin = req.headers.origin;
          if (origin && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin)) {
            return json(res, 403, { error: `origin not allowed: ${origin}` });
          }
        }

        try {
          /* ------------------------------------------------ GET /content */
          if (method === "GET" && route === "/content") {
            const all = {};
            for (const e of ENTITIES) all[e] = readEntity(e);
            return json(res, 200, all);
          }

          /* --------------------------------------- GET /content/:entity */
          if (method === "GET" && route.startsWith("/content/")) {
            const entity = route.slice("/content/".length);
            if (!pathFor(entity)) return json(res, 400, { error: "unknown entity" });
            return json(res, 200, readEntity(entity));
          }

          /* --------------------------------------- PUT /content/:entity */
          if (method === "PUT" && route.startsWith("/content/")) {
            const entity = route.slice("/content/".length);
            const file = pathFor(entity);
            if (!file) return json(res, 400, { error: "unknown entity" });

            const body = JSON.parse((await readBody(req)).toString("utf8"));
            const doc = body.doc;

            // Optimistic concurrency: refuse to clobber a file that changed
            // underneath the editor (a second tab, or a hand edit).
            const current = fs.statSync(file).mtimeMs;
            if (body.mtimeMs != null && Math.abs(body.mtimeMs - current) > 1) {
              return json(res, 409, {
                error: "file changed on disk since it was loaded",
                mtimeMs: current,
              });
            }

            const errors = validate(entity, doc);
            if (errors.length) return json(res, 422, { errors });

            writeFileAtomic(root, file, JSON.stringify(doc, null, 2) + "\n");
            return json(res, 200, { ok: true, mtimeMs: fs.statSync(file).mtimeMs });
          }

          /* -------------------------------------------------- GET /assets */
          if (method === "GET" && route === "/assets") {
            const kind = url.searchParams.get("kind") || "projects";
            const relDir = UPLOAD_DIRS.get(kind);
            if (!relDir) return json(res, 400, { error: "unknown asset kind" });
            const dir = path.join(root, relDir);
            const files = fs.existsSync(dir)
              ? fs.readdirSync(dir).filter((f) => IMAGE_TYPES.has(mimeOf(f)) || /\.(png|jpe?g|webp)$/i.test(f))
              : [];
            return json(res, 200, {
              kind,
              files: files.map((f) => ({
                name: f,
                path: `/${relDir.replace(/^public\//, "")}/${f}`,
                size: fs.statSync(path.join(dir, f)).size,
              })),
            });
          }

          /* ------------------------------------------------- POST /upload */
          if (method === "POST" && route === "/upload") {
            const kind = url.searchParams.get("kind") || "projects";
            const relDir = UPLOAD_DIRS.get(kind);
            if (!relDir) return json(res, 400, { error: "unknown asset kind" });

            const type = String(req.headers["content-type"] || "").split(";")[0].trim();
            const ext = IMAGE_TYPES.get(type);
            if (!ext) {
              return json(res, 415, {
                error: `unsupported image type "${type}" (png, jpeg or webp only)`,
              });
            }

            // Name comes from a query param but is slugified by the caller and
            // re-sanitised here; only the basename is ever used.
            const requested = path.basename(url.searchParams.get("name") || "upload");
            const safe = requested.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/\.[^.]*$/, "") || "upload";

            const dir = path.join(root, relDir);
            fs.mkdirSync(dir, { recursive: true });

            let file = path.join(dir, `${safe}${ext}`);
            let n = 2;
            while (fs.existsSync(file)) file = path.join(dir, `${safe}-${n++}${ext}`);
            assertInside(root, file);

            const bytes = await readBody(req);
            if (!bytes.length) return json(res, 400, { error: "empty upload" });
            fs.writeFileSync(file, bytes);

            return json(res, 200, {
              ok: true,
              path: `/${relDir.replace(/^public\//, "")}/${path.basename(file)}`,
              bytes: bytes.length,
            });
          }

          /* ------------------------------------------------- GET /status */
          if (method === "GET" && route === "/status") {
            const [branch, dirty] = await Promise.all([
              run("git", ["rev-parse", "--abbrev-ref", "HEAD"], root),
              run("git", ["status", "--porcelain", ...SOURCE_PATHS], root),
            ]);
            const problems = {};
            for (const e of ENTITIES) {
              const errs = validate(e, readEntity(e).doc);
              if (errs.length) problems[e] = errs;
            }
            return json(res, 200, {
              branch: branch.out,
              dirty: dirty.out ? dirty.out.split("\n") : [],
              valid: Object.keys(problems).length === 0,
              problems,
              publishing: publish.running,
            });
          }

          /* ----------------------------------------- GET /publish/stream */
          if (method === "GET" && route === "/publish/stream") {
            res.writeHead(200, {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
              connection: "keep-alive",
            });
            for (const line of publish.log) res.write(`data: ${JSON.stringify({ line })}\n\n`);
            publish.clients.add(res);
            req.on("close", () => publish.clients.delete(res));
            return;
          }

          /* ------------------------------------------------ POST /publish */
          if (method === "POST" && route === "/publish") {
            if (publish.running) return json(res, 409, { error: "a publish is already running" });

            const opts = JSON.parse((await readBody(req)).toString("utf8") || "{}");

            for (const e of ENTITIES) {
              const errs = validate(e, readEntity(e).doc);
              if (errs.length) {
                return json(res, 422, { error: `${e}.json is invalid`, errors: errs });
              }
            }

            publish.running = true;
            publish.log = [];
            publish.startedAt = Date.now();
            publish.result = null;
            json(res, 202, { started: true });

            (async () => {
              try {
                if (opts.commitSource) {
                  emit(`$ git add ${SOURCE_PATHS.join(" ")}`);
                  await run("git", ["add", ...SOURCE_PATHS], root);
                  const msg = opts.message?.trim() || "Update site content via admin";
                  emit(`$ git commit -m ${JSON.stringify(msg)}`);
                  const c = await run("git", ["commit", "-m", msg], root);
                  emit(c.out || "(nothing to commit)");
                  if (opts.push) {
                    emit("$ git push origin HEAD");
                    const p = await run("git", ["push", "origin", "HEAD"], root);
                    emit(p.out || "(pushed)");
                  }
                }

                emit("$ npm run deploy");
                const child = spawn(npmCmd(), ["run", "deploy"], { cwd: root, shell: false });
                child.stdout.on("data", (d) => String(d).split("\n").filter(Boolean).forEach(emit));
                child.stderr.on("data", (d) => String(d).split("\n").filter(Boolean).forEach(emit));

                const code = await new Promise((r) => {
                  child.on("close", r);
                  child.on("error", (e) => {
                    emit(`spawn failed: ${e}`);
                    r(-1);
                  });
                });

                publish.result = code === 0 ? "success" : "failed";
                emit(code === 0 ? "DEPLOY OK" : `DEPLOY FAILED (exit ${code})`);
              } catch (e) {
                publish.result = "failed";
                emit(`ERROR ${e?.message || e}`);
              } finally {
                publish.running = false;
                emit("__done__");
              }
            })();
            return;
          }

          return next();
        } catch (e) {
          if (e?.code === 413) return json(res, 413, { error: "payload too large" });
          return json(res, 500, { error: e?.message || String(e) });
        }
      });
    },
  };
}

function mimeOf(f) {
  const ext = path.extname(f).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "";
}

/**
 * Build-time guard: fails the build loudly if anything under src/ ever imports
 * from admin/, which would drag the editor into the shipped bundle.
 */
export function adminIsolationGuard() {
  return {
    name: "portfolio-admin-isolation",
    apply: "build",
    // Must be 'pre': resolveId hooks run in order until one returns a result,
    // and Vite's own resolver would otherwise handle the id before this sees it.
    enforce: "pre",
    resolveId(source, importer) {
      if (!importer) return null;
      const from = importer.replace(/\\/g, "/");
      const to = source.replace(/\\/g, "/");
      if (from.includes("/src/") && (to.includes("/admin/") || to.startsWith("admin/") || to.startsWith("./admin/"))) {
        this.error(`src/ must not import from admin/: ${importer} -> ${source}`);
      }
      return null;
    },
  };
}

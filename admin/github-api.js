// Deployed admin backend.
//
// The shipped /admin/ is static — there is no server to write files or run a
// deploy. Instead this talks straight to GitHub's Contents API: every save is
// a commit to `main`, authenticated with the token the user pastes at the
// login screen (stored only in their browser). A GitHub Actions workflow
// (.github/workflows/deploy.yml) rebuilds and pushes to gh-pages on each push,
// so saving here *is* publishing.
//
// It implements the same surface as the local dev client (admin/api.js), so
// App.jsx / ImageDrop.jsx don't care which backend is live. The `mtimeMs`
// field the UI threads through for optimistic concurrency carries a git blob
// SHA here instead of a file mtime — opaque to the UI either way.

import { ENTITIES } from "../tools/content-schema.js";
import { getToken } from "./auth";

export const REPO = {
  owner: "TylorDuong",
  repo: "tylorduong.github.io",
  branch: "main",
};

const GH = "https://api.github.com";

// Mirrors UPLOAD_DIRS in tools/vite-plugin-admin.js so the deployed and local
// backends drop images in the same place.
const UPLOAD_DIRS = { projects: "public/projects", avatars: "public/avatars" };
const EXT_FOR = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" };

/* ------------------------------------------------------------- base64 (utf-8) */

function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToUtf8(b64) {
  const bin = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function bytesToB64(bytes) {
  let bin = "";
  const chunk = 0x8000; // chunked so apply() doesn't blow the arg limit
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

/* -------------------------------------------------------------------- fetch */

async function gh(pathname, { method = "GET", body, params } = {}) {
  const token = getToken();
  const url = new URL(`${GH}/repos/${REPO.owner}/${REPO.repo}${pathname}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const e = new Error(data?.message || `${res.status} ${res.statusText}`);
    e.status = res.status;
    e.data = data;
    throw e;
  }
  return data;
}

const readFile = async (path) => {
  const data = await gh(`/contents/${path}`, { params: { ref: REPO.branch } });
  return { text: b64ToUtf8(data.content), sha: data.sha };
};

/* --------------------------------------------------------------- public API */

export const githubApi = {
  async loadAll() {
    const out = {};
    await Promise.all(
      ENTITIES.map(async (e) => {
        const { text, sha } = await readFile(`content/${e}.json`);
        out[e] = { doc: JSON.parse(text), mtimeMs: sha };
      })
    );
    return out;
  },

  async load(entity) {
    const { text, sha } = await readFile(`content/${entity}.json`);
    return { doc: JSON.parse(text), mtimeMs: sha };
  },

  async save(entity, doc, sha) {
    // GitHub rejects a PUT whose sha is stale with 409 — which App.jsx already
    // treats as "changed on disk, reload". No sha (brand-new file) is allowed.
    const res = await gh(`/contents/content/${entity}.json`, {
      method: "PUT",
      body: {
        message: `Update ${entity}.json via admin`,
        content: utf8ToB64(JSON.stringify(doc, null, 2) + "\n"),
        sha: sha || undefined,
        branch: REPO.branch,
      },
    });
    return { ok: true, mtimeMs: res.content.sha };
  },

  async assets(kind) {
    const relDir = UPLOAD_DIRS[kind];
    if (!relDir) throw new Error("unknown asset kind");
    let list;
    try {
      list = await gh(`/contents/${relDir}`, { params: { ref: REPO.branch } });
    } catch (e) {
      if (e.status === 404) return { kind, files: [] }; // dir doesn't exist yet
      throw e;
    }
    const files = (Array.isArray(list) ? list : [])
      .filter((f) => f.type === "file" && /\.(png|jpe?g|webp)$/i.test(f.name))
      .map((f) => ({
        name: f.name,
        path: `/${relDir.replace(/^public\//, "")}/${f.name}`,
        size: f.size,
      }));
    return { kind, files };
  },

  async upload(file, { kind, name }) {
    const relDir = UPLOAD_DIRS[kind];
    if (!relDir) throw new Error("unknown asset kind");

    const ext = EXT_FOR[file.type];
    if (!ext) throw new Error(`unsupported image type "${file.type}" (png, jpeg or webp only)`);

    const base =
      String(name || "upload")
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/\.[^.]*$/, "") || "upload";

    // Avoid clobbering an existing file (mirrors the local backend's `-2` suffix).
    let taken = [];
    try {
      taken = (await this.assets(kind)).files.map((f) => f.name);
    } catch {
      /* fall through: a 404/empty dir just means nothing to collide with */
    }
    let fname = `${base}${ext}`;
    let n = 2;
    while (taken.includes(fname)) fname = `${base}-${n++}${ext}`;

    const buf = new Uint8Array(await file.arrayBuffer());
    const res = await gh(`/contents/${relDir}/${fname}`, {
      method: "PUT",
      body: {
        message: `Upload ${fname} via admin`,
        content: bytesToB64(buf),
        branch: REPO.branch,
      },
    });
    void res;
    return { ok: true, path: `/${relDir.replace(/^public\//, "")}/${fname}`, bytes: buf.length };
  },

  // Verify the token still works and whether it can write. Hitting the repo
  // endpoint (gh("") → /repos/owner/repo) returns a `permissions` block scoped
  // to the token. Used by the login gate and the deployed Publish screen.
  async whoami() {
    const repo = await gh("");
    return {
      canWrite: !!repo.permissions?.push,
      repo: repo.full_name,
    };
  },
};

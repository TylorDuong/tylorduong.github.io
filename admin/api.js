// Admin backend selector.
//
// Local dev (`npm run admin`) talks to the loopback Vite plugin over
// /__admin/api — it writes files and can run a deploy. The deployed /admin/ is
// static, so there is no such server; it commits straight to GitHub instead
// (github-api.js). `import.meta.env.PROD` is a build-time constant, so in the
// production bundle the ternary folds to `githubApi` and the localApi branch
// (and its "/__admin/api" string) is tree-shaken away.

import { githubApi } from "./github-api";

const BASE = "/__admin/api";

async function req(path, { method = "GET", body, raw, contentType } = {}) {
  const headers = {};
  if (method !== "GET") headers["x-admin"] = "1";
  if (contentType) headers["content-type"] = contentType;
  else if (body !== undefined) headers["content-type"] = "application/json";

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    const e = new Error(data?.error || `${res.status} ${res.statusText}`);
    e.status = res.status;
    e.data = data;
    throw e;
  }
  return data;
}

const localApi = {
  loadAll: () => req("/content"),
  load: (entity) => req(`/content/${entity}`),
  save: (entity, doc, mtimeMs) => req(`/content/${entity}`, { method: "PUT", body: { doc, mtimeMs } }),
  assets: (kind) => req(`/assets?kind=${encodeURIComponent(kind)}`),
  status: () => req("/status"),
  publish: (opts) => req("/publish", { method: "POST", body: opts }),

  upload: (file, { kind, name }) =>
    req(`/upload?kind=${encodeURIComponent(kind)}&name=${encodeURIComponent(name)}`, {
      method: "POST",
      raw: file,
      contentType: file.type,
    }),

  // SSE log tail for a running publish. onLine receives each emitted line.
  streamPublish(onLine) {
    const es = new EventSource(`${BASE}/publish/stream`);
    es.onmessage = (ev) => {
      try {
        onLine(JSON.parse(ev.data).line);
      } catch {
        /* ignore malformed frames */
      }
    };
    return () => es.close();
  },
};

export const api = import.meta.env.PROD ? githubApi : localApi;

// Deployed-admin credential.
//
// On the deployed (static) site there is no server, so the "password" that
// gates /admin/ is a GitHub token: it authenticates the Contents-API writes in
// github-api.js, and without it nothing can be saved. It lives ONLY in this
// browser's localStorage — it is never part of the shipped bundle.
//
// In local dev there is no token: the loopback Vite plugin is the backend and
// the login screen is skipped (see App.jsx).

const KEY = "admin:gh-token";

export const getToken = () => {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
};

export const setToken = (t) => {
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage disabled — token simply won't persist */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};

export const hasToken = () => !!getToken();

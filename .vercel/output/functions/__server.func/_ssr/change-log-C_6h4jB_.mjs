const CHANGE_LOG_KEY = "lexora.change-log";
const CHANGE_LOG_CHANGED_EVENT = "lexora:change-log-changed";
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `log-${crypto.randomUUID()}`;
  }
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function writeLogs(logs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHANGE_LOG_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent(CHANGE_LOG_CHANGED_EVENT));
}
function getChangeLogs() {
  if (typeof window === "undefined") return [];
  const parsed = safeParse(
    localStorage.getItem(CHANGE_LOG_KEY),
    []
  );
  return parsed.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
function logChange(input) {
  const entry = {
    id: makeId(),
    actorEmail: input.actorEmail.trim().toLowerCase(),
    actorRole: input.actorRole,
    action: input.action,
    target: input.target.trim(),
    detail: input.detail?.trim() || void 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const current = getChangeLogs();
  const next = [entry, ...current].slice(0, 300);
  writeLogs(next);
  return entry;
}
function getVisibleChangeLogsForRole(role) {
  const all = getChangeLogs();
  if (role === "owner") {
    return all;
  }
  if (role === "admin") {
    return all.filter((entry) => entry.actorRole === "admin");
  }
  return [];
}
export {
  CHANGE_LOG_CHANGED_EVENT as C,
  CHANGE_LOG_KEY as a,
  getVisibleChangeLogsForRole as g,
  logChange as l
};

import { s as supabase } from "./router-CnQBulb0.mjs";
const CHANGE_LOG_KEY = "lexora.change-log";
const CHANGE_LOG_CHANGED_EVENT = "lexora:change-log-changed";
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `log-${crypto.randomUUID()}`;
  }
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGE_LOG_CHANGED_EVENT));
}
function fromRow(row) {
  return {
    id: row.id,
    actorEmail: row.actor_email,
    actorRole: row.actor_role,
    action: row.action,
    target: row.target,
    detail: row.detail ?? void 0,
    createdAt: row.created_at
  };
}
async function getChangeLogs() {
  const { data, error } = await supabase.from("change_logs").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getChangeLogs error", error);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row));
}
async function logChange(input) {
  const entry = {
    id: makeId(),
    actor_email: input.actorEmail.trim().toLowerCase(),
    actor_role: input.actorRole,
    action: input.action,
    target: input.target.trim(),
    detail: input.detail?.trim() || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { error } = await supabase.from("change_logs").insert(entry);
  if (error) throw error;
  dispatchChanged();
  return fromRow(entry);
}
async function getVisibleChangeLogsForRole(role) {
  const all = await getChangeLogs();
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

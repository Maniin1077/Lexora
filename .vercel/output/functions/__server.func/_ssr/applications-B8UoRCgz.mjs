import { s as supabase } from "./router-CnQBulb0.mjs";
const KEY_PREFIX = "lexora.applied.";
const APPLIED_KEY_PREFIX = KEY_PREFIX;
const APPLIED_CHANGED_EVENT = "lexora:applied-changed";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function inferKind(item) {
  if (item.kind === "internship" || item.kind === "magazine") return item.kind;
  return item.id.startsWith("mag_") ? "magazine" : "internship";
}
function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
}
function toRow(email, item) {
  return {
    email,
    item_id: item.id,
    title: item.title,
    organization: item.organization,
    applied_at: item.appliedAt,
    link: item.link,
    kind: inferKind(item),
    deadline: item.deadline ?? null
  };
}
function fromRow(row) {
  return {
    id: row.item_id,
    title: row.title,
    organization: row.organization,
    appliedAt: row.applied_at,
    link: row.link,
    kind: row.kind,
    deadline: row.deadline
  };
}
async function getApplied(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  const { data, error } = await supabase.from("applications").select("item_id,title,organization,applied_at,link,kind,deadline").eq("email", normalized).order("applied_at", { ascending: false });
  if (error) {
    console.error("getApplied error", error);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row));
}
async function isApplied(email, id) {
  return (await getApplied(email)).some((a) => a.id === id);
}
async function markApplied(email, item) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  const nextItem = {
    ...item,
    kind: inferKind(item)
  };
  const { error } = await supabase.from("applications").upsert(toRow(normalized, nextItem));
  if (error) throw error;
  dispatchChanged();
  return [nextItem, ...(await getApplied(normalized)).filter((row) => row.id !== nextItem.id)];
}
async function removeApplied(email, id) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  const { error } = await supabase.from("applications").delete().eq("email", normalized).eq("item_id", id);
  if (error) throw error;
  dispatchChanged();
  return (await getApplied(normalized)).filter((a) => a.id !== id);
}
async function getAllAppliedByUsers() {
  const { data, error } = await supabase.from("applications").select("email,item_id,title,organization,applied_at,link,kind,deadline").order("email", { ascending: true });
  if (error) {
    console.error("getAllAppliedByUsers error", error);
    return [];
  }
  const grouped = /* @__PURE__ */ new Map();
  for (const row of data ?? []) {
    const normalized = row.email;
    const list = grouped.get(normalized) ?? [];
    list.push(fromRow(row));
    grouped.set(normalized, list);
  }
  return Array.from(grouped.entries()).map(([emailKey, items]) => ({
    email: emailKey,
    items,
    internshipApplications: items.filter((item) => inferKind(item) === "internship").length,
    magazineApplications: items.filter((item) => inferKind(item) === "magazine").length
  }));
}
async function getApplicationSummary() {
  const rows = await getAllAppliedByUsers();
  let usersAppliedInternships = 0;
  let usersAppliedMagazines = 0;
  let totalInternshipApplications = 0;
  let totalMagazineApplications = 0;
  for (const row of rows) {
    if (row.internshipApplications > 0) usersAppliedInternships += 1;
    if (row.magazineApplications > 0) usersAppliedMagazines += 1;
    totalInternshipApplications += row.internshipApplications;
    totalMagazineApplications += row.magazineApplications;
  }
  return {
    usersAppliedInternships,
    usersAppliedMagazines,
    totalInternshipApplications,
    totalMagazineApplications
  };
}
export {
  APPLIED_CHANGED_EVENT as A,
  getApplicationSummary as a,
  APPLIED_KEY_PREFIX as b,
  getApplied as g,
  isApplied as i,
  markApplied as m,
  removeApplied as r
};

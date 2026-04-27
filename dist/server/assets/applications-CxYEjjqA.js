const KEY_PREFIX = "lexora.applied.";
const APPLIED_KEY_PREFIX = KEY_PREFIX;
const APPLIED_CHANGED_EVENT = "lexora:applied-changed";
function key(email) {
  return KEY_PREFIX + (email ?? "guest").toLowerCase();
}
function inferKind(item) {
  if (item.kind === "internship" || item.kind === "magazine") return item.kind;
  return item.id.startsWith("mag_") ? "magazine" : "internship";
}
function withKind(item) {
  return {
    ...item,
    kind: inferKind(item)
  };
}
function readAppliedByStorageKey(storageKey) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.map(withKind);
  } catch {
    return [];
  }
}
function getApplied(email) {
  return readAppliedByStorageKey(key(email));
}
function isApplied(email, id) {
  return getApplied(email).some((a) => a.id === id);
}
function markApplied(email, item) {
  const all = getApplied(email);
  if (all.some((a) => a.id === item.id)) return all;
  const next = [withKind(item), ...all];
  localStorage.setItem(key(email), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
  return next;
}
function removeApplied(email, id) {
  const next = getApplied(email).filter((a) => a.id !== id);
  localStorage.setItem(key(email), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
  return next;
}
function getAllAppliedByUsers() {
  if (typeof window === "undefined") return [];
  const rows = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const storageKey = localStorage.key(i);
    if (!storageKey || !storageKey.startsWith(KEY_PREFIX)) continue;
    const email = storageKey.slice(KEY_PREFIX.length) || "guest";
    const items = readAppliedByStorageKey(storageKey);
    const internshipApplications = items.filter(
      (item) => inferKind(item) === "internship"
    ).length;
    const magazineApplications = items.filter(
      (item) => inferKind(item) === "magazine"
    ).length;
    rows.push({
      email,
      items,
      internshipApplications,
      magazineApplications
    });
  }
  return rows.sort((a, b) => a.email.localeCompare(b.email));
}
function getApplicationSummary() {
  const rows = getAllAppliedByUsers();
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

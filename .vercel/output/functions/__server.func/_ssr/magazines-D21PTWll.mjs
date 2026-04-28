const MAGAZINES_KEY = "lexora.magazines";
const MAGAZINES_CHANGED_EVENT = "lexora:magazines-changed";
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MAGAZINES_CHANGED_EVENT));
}
function writeMagazines(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MAGAZINES_KEY, JSON.stringify(items));
  notifyChanged();
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function getMagazines() {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(MAGAZINES_KEY), []);
}
function addMagazine(input) {
  const next = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registration_link,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.posted_by_email,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const items = getMagazines();
  writeMagazines([next, ...items]);
  return next;
}
function updateMagazine(id, input) {
  const items = getMagazines();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Opportunity not found.");
  }
  const updatedItem = {
    ...items[idx],
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registration_link,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.posted_by_email
  };
  const next = [...items];
  next[idx] = updatedItem;
  writeMagazines(next);
  return updatedItem;
}
function removeMagazine(id) {
  const next = getMagazines().filter((item) => item.id !== id);
  writeMagazines(next);
}
export {
  MAGAZINES_CHANGED_EVENT as M,
  MAGAZINES_KEY as a,
  addMagazine as b,
  getMagazines as g,
  removeMagazine as r,
  updateMagazine as u
};

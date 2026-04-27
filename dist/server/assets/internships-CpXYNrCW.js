const INTERNSHIPS_KEY = "lexora.internships";
const INTERNSHIPS_CHANGED_EVENT = "lexora:internships-changed";
const DEFAULT_INTERNSHIPS = [
  {
    id: "internship-lexora-research",
    title: "Research Internship",
    organization: "Lexora Community",
    description: "One-month online programme with editorial mentorship, research workflow training, and publication opportunities.",
    registrationLink: "https://forms.gle/eBkeM3TuBiDSraJo7",
    deadline: (/* @__PURE__ */ new Date("2026-12-31T23:59:00.000Z")).toISOString(),
    tags: ["Remote", "1 Month", "Research"],
    postedByEmail: "bsmanikanta2004@gmail.com",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  }
];
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
  window.dispatchEvent(new CustomEvent(INTERNSHIPS_CHANGED_EVENT));
}
function writeInternships(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(items));
  notifyChanged();
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `internship-${crypto.randomUUID()}`;
  }
  return `internship_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function seedInternships() {
  if (typeof window === "undefined") return [];
  const parsed = safeParse(
    localStorage.getItem(INTERNSHIPS_KEY),
    []
  );
  if (parsed.length > 0) return parsed;
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(DEFAULT_INTERNSHIPS));
  return DEFAULT_INTERNSHIPS;
}
function getInternships() {
  return seedInternships();
}
function addInternship(input) {
  const next = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registrationLink: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    postedByEmail: input.postedByEmail,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const items = getInternships();
  writeInternships([next, ...items]);
  return next;
}
function updateInternship(id, input) {
  const items = getInternships();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Internship not found.");
  }
  const updatedItem = {
    ...items[idx],
    title: input.title,
    organization: input.organization,
    description: input.description,
    registrationLink: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    postedByEmail: input.postedByEmail
  };
  const next = [...items];
  next[idx] = updatedItem;
  writeInternships(next);
  return updatedItem;
}
function removeInternship(id) {
  const next = getInternships().filter((item) => item.id !== id);
  writeInternships(next);
}
export {
  INTERNSHIPS_CHANGED_EVENT as I,
  INTERNSHIPS_KEY as a,
  addInternship as b,
  getInternships as g,
  removeInternship as r,
  updateInternship as u
};

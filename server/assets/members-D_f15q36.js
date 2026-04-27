const anadi = "/Lexora/assets/Picture1-D0pet-62.jpg";
const mohith = "/Lexora/assets/Picture2-B7ocIO5n.jpg";
const shreya = "/Lexora/assets/Picture4-CWGK0Gp1.jpg";
const prianshu = "/Lexora/assets/Picture5-ClqZakGG.jpg";
const charitha = "/Lexora/assets/Picture6-RpQ8LUAU.jpg";
const seshank = "/Lexora/assets/Picture7-B11DSs8d.png";
const kanishka = "/Lexora/assets/Picture8-fRVtmX5I.jpg";
const MEMBERS_KEY = "lexora.members";
const MEMBERS_CHANGED_EVENT = "lexora:members-changed";
const DEFAULT_MEMBERS = [
  {
    id: "member-anadi-sahu",
    name: "Anadi Sahu",
    image: anadi,
    role: "founder",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-mohith-reddy",
    name: "R V Mohith Reddy",
    image: mohith,
    role: "founder",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-vemula-shreya",
    name: "Vemula Shreya",
    image: shreya,
    role: "founder",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-prianshu-tiwari",
    name: "Prianshu Tiwari",
    image: prianshu,
    role: "core",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-charitha-chowdhary",
    name: "Charitha Chowdhary",
    image: charitha,
    role: "core",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-venkata-seshank",
    name: "Venkata Seshank",
    image: seshank,
    role: "core",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  },
  {
    id: "member-kanishka-maram",
    name: "Kanishka Maram",
    image: kanishka,
    role: "core",
    createdAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
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
  window.dispatchEvent(new CustomEvent(MEMBERS_CHANGED_EVENT));
}
function writeMembers(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(items));
  notifyChanged();
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `member-${crypto.randomUUID()}`;
  }
  return `member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function seedMembers() {
  if (typeof window === "undefined") return [];
  const parsed = safeParse(localStorage.getItem(MEMBERS_KEY), []);
  if (parsed.length > 0) return parsed;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
  return DEFAULT_MEMBERS;
}
function getMembers() {
  return seedMembers();
}
function addMember(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const next = {
    id: makeId(),
    name: input.name,
    image: input.image,
    role: input.role,
    createdAt: now,
    updatedAt: now
  };
  const items = getMembers();
  writeMembers([next, ...items]);
  return next;
}
function updateMember(id, input) {
  const items = getMembers();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Member not found.");
  }
  const updated = {
    ...items[idx],
    name: input.name,
    image: input.image,
    role: input.role,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const next = [...items];
  next[idx] = updated;
  writeMembers(next);
  return updated;
}
function removeMember(id) {
  const next = getMembers().filter((item) => item.id !== id);
  writeMembers(next);
}
export {
  MEMBERS_CHANGED_EVENT as M,
  MEMBERS_KEY as a,
  addMember as b,
  getMembers as g,
  removeMember as r,
  updateMember as u
};

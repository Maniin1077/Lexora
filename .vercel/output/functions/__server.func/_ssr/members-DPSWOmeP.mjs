import { s as supabase } from "./router-DqURmC3W.mjs";
const anadi = "/assets/Picture1-D0pet-62.jpg";
const mohith = "/assets/Picture2-B7ocIO5n.jpg";
const shreya = "/assets/Picture4-CWGK0Gp1.jpg";
const prianshu = "/assets/Picture5-ClqZakGG.jpg";
const charitha = "/assets/Picture6-RpQ8LUAU.jpg";
const seshank = "/assets/Picture7-B11DSs8d.png";
const kanishka = "/assets/Picture8-fRVtmX5I.jpg";
const MEMBERS_KEY = "lexora.members";
const MEMBERS_CHANGED_EVENT = "lexora:members-changed";
[
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
function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MEMBERS_CHANGED_EVENT));
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `member-${crypto.randomUUID()}`;
  }
  return `member_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
async function getMembers() {
  const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: true });
  if (error) {
    console.error("getMembers error", error);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row));
}
async function addMember(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const next = {
    id: makeId(),
    name: input.name,
    image: input.image,
    role: input.role,
    created_at: now,
    updated_at: now
  };
  const { data, error } = await supabase.from("members").insert(next).select().single();
  if (error) throw error;
  notifyChanged();
  return fromRow(data);
}
async function updateMember(id, input) {
  const payload = {
    name: input.name,
    image: input.image,
    role: input.role,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { data, error } = await supabase.from("members").update(payload).eq("id", id).select().single();
  if (error) throw error;
  notifyChanged();
  return fromRow(data);
}
async function removeMember(id) {
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
  notifyChanged();
}
export {
  MEMBERS_CHANGED_EVENT as M,
  MEMBERS_KEY as a,
  addMember as b,
  getMembers as g,
  removeMember as r,
  updateMember as u
};

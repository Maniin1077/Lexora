import { s as supabase } from "./router-CnQBulb0.mjs";
const INTERNSHIPS_KEY = "lexora.internships";
const INTERNSHIPS_CHANGED_EVENT = "lexora:internships-changed";
[
  {
    id: "internship-lexora-research",
    title: "Research Internship",
    organization: "Lexora Community",
    description: "One-month online programme with editorial mentorship, research workflow training, and publication opportunities.",
    registration_link: "https://forms.gle/eBkeM3TuBiDSraJo7",
    deadline: (/* @__PURE__ */ new Date("2026-12-31T23:59:00.000Z")).toISOString(),
    tags: ["Remote", "1 Month", "Research"],
    posted_by_email: "bsmanikanta2004@gmail.com",
    created_at: (/* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")).toISOString()
  }
];
let _cache = null;
function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTERNSHIPS_CHANGED_EVENT));
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `internship-${crypto.randomUUID()}`;
  }
  return `internship_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    description: row.description,
    registrationLink: row.registration_link,
    deadline: row.deadline,
    tags: row.tags,
    postedByEmail: row.posted_by_email,
    createdAt: row.created_at
  };
}
async function getInternships() {
  if (_cache) return _cache;
  const { data, error } = await supabase.from("internships").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getInternships error", error);
    return [];
  }
  _cache = (data ?? []).map((row) => fromRow(row));
  return _cache;
}
async function addInternship(input) {
  const payload = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.postedByEmail,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { data, error } = await supabase.from("internships").insert(payload).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return fromRow(data);
}
async function updateInternship(id, input) {
  const payload = {
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.postedByEmail
  };
  const { data, error } = await supabase.from("internships").update(payload).eq("id", id).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return fromRow(data);
}
async function removeInternship(id) {
  const { error } = await supabase.from("internships").delete().eq("id", id);
  if (error) throw error;
  _cache = null;
  notifyChanged();
}
export {
  INTERNSHIPS_CHANGED_EVENT as I,
  INTERNSHIPS_KEY as a,
  addInternship as b,
  getInternships as g,
  removeInternship as r,
  updateInternship as u
};

import { s as supabase } from "./router-CnQBulb0.mjs";
const MAGAZINES_KEY = "lexora.magazines";
const MAGAZINES_CHANGED_EVENT = "lexora:magazines-changed";
let _cache = null;
function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MAGAZINES_CHANGED_EVENT));
}
async function getMagazines() {
  if (_cache) return _cache;
  const { data, error } = await supabase.from("magazines").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getMagazines error", error);
    return [];
  }
  _cache = data ?? [];
  return _cache;
}
async function addMagazine(input) {
  const payload = { ...input, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  const { data, error } = await supabase.from("magazines").insert(payload).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return data;
}
async function updateMagazine(id, input) {
  const { data, error } = await supabase.from("magazines").update(input).eq("id", id).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return data;
}
async function removeMagazine(id) {
  const { error } = await supabase.from("magazines").delete().eq("id", id);
  if (error) throw error;
  _cache = null;
  notifyChanged();
}
function subscribeMagazines(onChange) {
  try {
    const chan = supabase.channel("public:magazines").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "magazines" },
      (payload) => {
        _cache = null;
        notifyChanged();
        onChange();
      }
    );
    void chan.subscribe();
    return () => {
      try {
        void chan.unsubscribe();
      } catch (e) {
      }
    };
  } catch (e) {
    return () => {
    };
  }
}
export {
  MAGAZINES_CHANGED_EVENT as M,
  MAGAZINES_KEY as a,
  addMagazine as b,
  getMagazines as g,
  removeMagazine as r,
  subscribeMagazines as s,
  updateMagazine as u
};

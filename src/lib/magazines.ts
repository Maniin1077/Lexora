import { supabase } from "@/integrations/supabase/client";

export interface MagazineItem {
  id: string;
  title: string;
  organization: string;
  description: string;
  registration_link: string;
  deadline: string;
  tags: string[] | null;
  posted_by_email: string | null;
  created_at: string;
}

export interface MagazineInput {
  title: string;
  organization: string;
  description: string;
  registration_link: string;
  deadline: string;
  tags: string[] | null;
  posted_by_email: string | null;
}

export const MAGAZINES_KEY = "lexora.magazines";
export const MAGAZINES_CHANGED_EVENT = "lexora:magazines-changed";

let _cache: MagazineItem[] | null = null;

function notifyChanged() {
  if (typeof window === "undefined") return;
  // keep the old event so UI code can reuse it
  window.dispatchEvent(new CustomEvent(MAGAZINES_CHANGED_EVENT));
}

export async function getMagazines(): Promise<MagazineItem[]> {
  if (_cache) return _cache;

  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMagazines error", error);
    return [];
  }

  _cache = (data ?? []) as MagazineItem[];
  return _cache;
}

export async function addMagazine(input: MagazineInput): Promise<MagazineItem | null> {
  const payload = { ...input, created_at: new Date().toISOString() };
  const { data, error } = await supabase.from("magazines").insert(payload).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return data as MagazineItem;
}

export async function updateMagazine(id: string, input: MagazineInput): Promise<MagazineItem | null> {
  const { data, error } = await supabase
    .from("magazines")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return data as MagazineItem;
}

export async function removeMagazine(id: string): Promise<void> {
  const { error } = await supabase.from("magazines").delete().eq("id", id);
  if (error) throw error;
  _cache = null;
  notifyChanged();
}

export function subscribeMagazines(onChange: () => void) {
  // subscribe to Postgres changes for magazines and notify the app
  try {
    const chan: any = supabase.channel("public:magazines").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "magazines" },
      (payload: any) => {
        _cache = null;
        notifyChanged();
        onChange();
      },
    );

    void chan.subscribe();

    return () => {
      try {
        void chan.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  } catch (e) {
    return () => {};
  }
}

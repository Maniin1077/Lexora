import anadi from "@/assets/members/Picture1.jpg";
import mohith from "@/assets/members/Picture2.jpg";
import shreya from "@/assets/members/Picture4.jpg";
import prianshu from "@/assets/members/Picture5.jpg";
import charitha from "@/assets/members/Picture6.jpg";
import seshank from "@/assets/members/Picture7.png";
import kanishka from "@/assets/members/Picture8.jpg";
import { supabase } from "@/integrations/supabase/client";

export type MemberRole = "founder" | "core";

export interface MemberItem {
  id: string;
  name: string;
  image: string;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
}

export interface MemberInput {
  name: string;
  image: string;
  role: MemberRole;
}

export const MEMBERS_KEY = "lexora.members";
export const MEMBERS_CHANGED_EVENT = "lexora:members-changed";

type MemberRow = {
  id: string;
  name: string;
  image: string;
  role: MemberRole;
  created_at: string;
  updated_at: string;
};

const DEFAULT_MEMBERS: MemberItem[] = [
  {
    id: "member-anadi-sahu",
    name: "Anadi Sahu",
    image: anadi,
    role: "founder",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-mohith-reddy",
    name: "R V Mohith Reddy",
    image: mohith,
    role: "founder",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-vemula-shreya",
    name: "Vemula Shreya",
    image: shreya,
    role: "founder",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-prianshu-tiwari",
    name: "Prianshu Tiwari",
    image: prianshu,
    role: "core",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-charitha-chowdhary",
    name: "Charitha Chowdhary",
    image: charitha,
    role: "core",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-venkata-seshank",
    name: "Venkata Seshank",
    image: seshank,
    role: "core",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "member-kanishka-maram",
    name: "Kanishka Maram",
    image: kanishka,
    role: "core",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
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

function fromRow(row: MemberRow): MemberItem {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getMembers(): Promise<MemberItem[]> {
  const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: true });
  if (error) {
    console.error("getMembers error", error);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row as MemberRow));
}

export async function addMember(input: MemberInput): Promise<MemberItem> {
  const now = new Date().toISOString();
  const next: MemberRow = {
    id: makeId(),
    name: input.name,
    image: input.image,
    role: input.role,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase.from("members").insert(next).select().single();
  if (error) throw error;
  notifyChanged();
  return fromRow(data as MemberRow);
}

export async function updateMember(id: string, input: MemberInput): Promise<MemberItem> {
  const payload = {
    name: input.name,
    image: input.image,
    role: input.role,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("members").update(payload).eq("id", id).select().single();
  if (error) throw error;
  notifyChanged();
  return fromRow(data as MemberRow);
}

export async function removeMember(id: string) {
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
  notifyChanged();
}

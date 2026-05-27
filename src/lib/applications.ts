import { supabase } from "@/integrations/supabase/client";

export type AppliedKind = "internship" | "magazine";

export interface AppliedItem {
  id: string;
  title: string;
  organization: string;
  appliedAt: string;
  link: string;
  kind?: AppliedKind;
  deadline?: string | null;
}

export interface AppliedByUser {
  email: string;
  items: AppliedItem[];
  internshipApplications: number;
  magazineApplications: number;
}

export interface ApplicationSummary {
  usersAppliedInternships: number;
  usersAppliedMagazines: number;
  totalInternshipApplications: number;
  totalMagazineApplications: number;
}

const KEY_PREFIX = "lexora.applied.";
export const APPLIED_KEY_PREFIX = KEY_PREFIX;
export const APPLIED_CHANGED_EVENT = "lexora:applied-changed";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function inferKind(item: AppliedItem): AppliedKind {
  if (item.kind === "internship" || item.kind === "magazine") return item.kind;
  return item.id.startsWith("mag_") ? "magazine" : "internship";
}

function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
}

function toRow(email: string, item: AppliedItem) {
  return {
    email,
    item_id: item.id,
    title: item.title,
    organization: item.organization,
    applied_at: item.appliedAt,
    link: item.link,
    kind: inferKind(item),
    deadline: item.deadline ?? null,
  };
}

function fromRow(row: {
  item_id: string;
  title: string;
  organization: string;
  applied_at: string;
  link: string;
  kind: AppliedKind;
  deadline: string | null;
}) : AppliedItem {
  return {
    id: row.item_id,
    title: row.title,
    organization: row.organization,
    appliedAt: row.applied_at,
    link: row.link,
    kind: row.kind,
    deadline: row.deadline,
  };
}

export async function getApplied(email: string | null | undefined): Promise<AppliedItem[]> {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];

  const { data, error } = await supabase
    .from("applications")
    .select("item_id,title,organization,applied_at,link,kind,deadline")
    .eq("email", normalized)
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("getApplied error", error);
    return [];
  }

  return (data ?? []).map((row) => fromRow(row as any));
}

export async function isApplied(email: string | null | undefined, id: string) {
  return (await getApplied(email)).some((a) => a.id === id);
}

export async function markApplied(
  email: string | null | undefined,
  item: AppliedItem,
) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [] as AppliedItem[];

  const nextItem = {
    ...item,
    kind: inferKind(item),
  };

  const { error } = await supabase.from("applications").upsert(toRow(normalized, nextItem));
  if (error) throw error;
  dispatchChanged();
  return [nextItem, ...(await getApplied(normalized)).filter((row) => row.id !== nextItem.id)];
}

export async function removeApplied(email: string | null | undefined, id: string) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [] as AppliedItem[];

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("email", normalized)
    .eq("item_id", id);
  if (error) throw error;
  dispatchChanged();
  return (await getApplied(normalized)).filter((a) => a.id !== id);
}

export async function getAllAppliedByUsers(): Promise<AppliedByUser[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("email,item_id,title,organization,applied_at,link,kind,deadline")
    .order("email", { ascending: true });

  if (error) {
    console.error("getAllAppliedByUsers error", error);
    return [];
  }

  const grouped = new Map<string, AppliedItem[]>();
  for (const row of data ?? []) {
    const normalized = (row as any).email as string;
    const list = grouped.get(normalized) ?? [];
    list.push(fromRow(row as any));
    grouped.set(normalized, list);
  }

  return Array.from(grouped.entries()).map(([emailKey, items]) => ({
    email: emailKey,
    items,
    internshipApplications: items.filter((item) => inferKind(item) === "internship").length,
    magazineApplications: items.filter((item) => inferKind(item) === "magazine").length,
  }));
}

export async function getApplicationSummary(): Promise<ApplicationSummary> {
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
    totalMagazineApplications,
  };
}

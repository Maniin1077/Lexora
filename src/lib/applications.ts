// Local-storage tracking of user-applied internships and magazines.

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

function key(email: string | null | undefined) {
  return KEY_PREFIX + (email ?? "guest").toLowerCase();
}

function inferKind(item: AppliedItem): AppliedKind {
  if (item.kind === "internship" || item.kind === "magazine") return item.kind;
  return item.id.startsWith("mag_") ? "magazine" : "internship";
}

function withKind(item: AppliedItem): AppliedItem {
  return {
    ...item,
    kind: inferKind(item),
  };
}

function readAppliedByStorageKey(storageKey: string): AppliedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as AppliedItem[]) : [];
    return parsed.map(withKind);
  } catch {
    return [];
  }
}

export function getApplied(email: string | null | undefined): AppliedItem[] {
  return readAppliedByStorageKey(key(email));
}

export function isApplied(email: string | null | undefined, id: string) {
  return getApplied(email).some((a) => a.id === id);
}

export function markApplied(
  email: string | null | undefined,
  item: AppliedItem,
) {
  const all = getApplied(email);
  if (all.some((a) => a.id === item.id)) return all;
  const next = [withKind(item), ...all];
  localStorage.setItem(key(email), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
  return next;
}

export function removeApplied(email: string | null | undefined, id: string) {
  const next = getApplied(email).filter((a) => a.id !== id);
  localStorage.setItem(key(email), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(APPLIED_CHANGED_EVENT));
  return next;
}

export function getAllAppliedByUsers(): AppliedByUser[] {
  if (typeof window === "undefined") return [];

  const rows: AppliedByUser[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const storageKey = localStorage.key(i);
    if (!storageKey || !storageKey.startsWith(KEY_PREFIX)) continue;

    const email = storageKey.slice(KEY_PREFIX.length) || "guest";
    const items = readAppliedByStorageKey(storageKey);
    const internshipApplications = items.filter(
      (item) => inferKind(item) === "internship",
    ).length;
    const magazineApplications = items.filter(
      (item) => inferKind(item) === "magazine",
    ).length;

    rows.push({
      email,
      items,
      internshipApplications,
      magazineApplications,
    });
  }

  return rows.sort((a, b) => a.email.localeCompare(b.email));
}

export function getApplicationSummary(): ApplicationSummary {
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
    totalMagazineApplications,
  };
}

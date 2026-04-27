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

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MAGAZINES_CHANGED_EVENT));
}

function writeMagazines(items: MagazineItem[]) {
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

export function getMagazines(): MagazineItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<MagazineItem[]>(localStorage.getItem(MAGAZINES_KEY), []);
}

export function addMagazine(input: MagazineInput): MagazineItem {
  const next: MagazineItem = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registration_link,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.posted_by_email,
    created_at: new Date().toISOString(),
  };

  const items = getMagazines();
  writeMagazines([next, ...items]);
  return next;
}

export function updateMagazine(id: string, input: MagazineInput): MagazineItem {
  const items = getMagazines();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Opportunity not found.");
  }

  const updatedItem: MagazineItem = {
    ...items[idx],
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registration_link,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.posted_by_email,
  };

  const next = [...items];
  next[idx] = updatedItem;
  writeMagazines(next);
  return updatedItem;
}

export function removeMagazine(id: string) {
  const next = getMagazines().filter((item) => item.id !== id);
  writeMagazines(next);
}

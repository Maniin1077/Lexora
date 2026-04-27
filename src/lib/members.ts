import anadi from "@/assets/members/Picture1.jpg";
import mohith from "@/assets/members/Picture2.jpg";
import shreya from "@/assets/members/Picture4.jpg";
import prianshu from "@/assets/members/Picture5.jpg";
import charitha from "@/assets/members/Picture6.jpg";
import seshank from "@/assets/members/Picture7.png";
import kanishka from "@/assets/members/Picture8.jpg";

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
  window.dispatchEvent(new CustomEvent(MEMBERS_CHANGED_EVENT));
}

function writeMembers(items: MemberItem[]) {
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

  const parsed = safeParse<MemberItem[]>(localStorage.getItem(MEMBERS_KEY), []);
  if (parsed.length > 0) return parsed;

  localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
  return DEFAULT_MEMBERS;
}

export function getMembers(): MemberItem[] {
  return seedMembers();
}

export function addMember(input: MemberInput): MemberItem {
  const now = new Date().toISOString();
  const next: MemberItem = {
    id: makeId(),
    name: input.name,
    image: input.image,
    role: input.role,
    createdAt: now,
    updatedAt: now,
  };

  const items = getMembers();
  writeMembers([next, ...items]);
  return next;
}

export function updateMember(id: string, input: MemberInput): MemberItem {
  const items = getMembers();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Member not found.");
  }

  const updated: MemberItem = {
    ...items[idx],
    name: input.name,
    image: input.image,
    role: input.role,
    updatedAt: new Date().toISOString(),
  };

  const next = [...items];
  next[idx] = updated;
  writeMembers(next);
  return updated;
}

export function removeMember(id: string) {
  const next = getMembers().filter((item) => item.id !== id);
  writeMembers(next);
}

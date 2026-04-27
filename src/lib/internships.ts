export interface InternshipItem {
  id: string;
  title: string;
  organization: string;
  description: string;
  registrationLink: string;
  deadline: string;
  tags: string[] | null;
  postedByEmail: string | null;
  createdAt: string;
}

export interface InternshipInput {
  title: string;
  organization: string;
  description: string;
  registrationLink: string;
  deadline: string;
  tags: string[] | null;
  postedByEmail: string | null;
}

export const INTERNSHIPS_KEY = "lexora.internships";
export const INTERNSHIPS_CHANGED_EVENT = "lexora:internships-changed";

const DEFAULT_INTERNSHIPS: InternshipItem[] = [
  {
    id: "internship-lexora-research",
    title: "Research Internship",
    organization: "Lexora Community",
    description:
      "One-month online programme with editorial mentorship, research workflow training, and publication opportunities.",
    registrationLink: "https://forms.gle/eBkeM3TuBiDSraJo7",
    deadline: new Date("2026-12-31T23:59:00.000Z").toISOString(),
    tags: ["Remote", "1 Month", "Research"],
    postedByEmail: "bsmanikanta2004@gmail.com",
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
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
  window.dispatchEvent(new CustomEvent(INTERNSHIPS_CHANGED_EVENT));
}

function writeInternships(items: InternshipItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(items));
  notifyChanged();
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `internship-${crypto.randomUUID()}`;
  }
  return `internship_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function seedInternships() {
  if (typeof window === "undefined") return [];

  const parsed = safeParse<InternshipItem[]>(
    localStorage.getItem(INTERNSHIPS_KEY),
    [],
  );
  if (parsed.length > 0) return parsed;

  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(DEFAULT_INTERNSHIPS));
  return DEFAULT_INTERNSHIPS;
}

export function getInternships(): InternshipItem[] {
  return seedInternships();
}

export function addInternship(input: InternshipInput): InternshipItem {
  const next: InternshipItem = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registrationLink: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    postedByEmail: input.postedByEmail,
    createdAt: new Date().toISOString(),
  };

  const items = getInternships();
  writeInternships([next, ...items]);
  return next;
}

export function updateInternship(
  id: string,
  input: InternshipInput,
): InternshipItem {
  const items = getInternships();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Internship not found.");
  }

  const updatedItem: InternshipItem = {
    ...items[idx],
    title: input.title,
    organization: input.organization,
    description: input.description,
    registrationLink: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    postedByEmail: input.postedByEmail,
  };

  const next = [...items];
  next[idx] = updatedItem;
  writeInternships(next);
  return updatedItem;
}

export function removeInternship(id: string) {
  const next = getInternships().filter((item) => item.id !== id);
  writeInternships(next);
}

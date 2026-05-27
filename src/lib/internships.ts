import { supabase } from "@/integrations/supabase/client";

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

type InternshipRow = {
  id: string;
  title: string;
  organization: string;
  description: string;
  registration_link: string;
  deadline: string;
  tags: string[] | null;
  posted_by_email: string | null;
  created_at: string;
};

const DEFAULT_INTERNSHIPS: InternshipRow[] = [
  {
    id: "internship-lexora-research",
    title: "Research Internship",
    organization: "Lexora Community",
    description:
      "One-month online programme with editorial mentorship, research workflow training, and publication opportunities.",
    registration_link: "https://forms.gle/eBkeM3TuBiDSraJo7",
    deadline: new Date("2026-12-31T23:59:00.000Z").toISOString(),
    tags: ["Remote", "1 Month", "Research"],
    posted_by_email: "bsmanikanta2004@gmail.com",
    created_at: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
];

let _cache: InternshipItem[] | null = null;

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

function fromRow(row: InternshipRow): InternshipItem {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    description: row.description,
    registrationLink: row.registration_link,
    deadline: row.deadline,
    tags: row.tags,
    postedByEmail: row.posted_by_email,
    createdAt: row.created_at,
  };
}

export async function getInternships(): Promise<InternshipItem[]> {
  if (_cache) return _cache;

  const { data, error } = await supabase
    .from("internships")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getInternships error", error);
    return [];
  }

  _cache = (data ?? []).map((row) => fromRow(row as InternshipRow));
  return _cache;
}

export async function addInternship(input: InternshipInput): Promise<InternshipItem> {
  const payload = {
    id: makeId(),
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.postedByEmail,
    created_at: new Date().toISOString(),
  } satisfies InternshipRow;

  const { data, error } = await supabase.from("internships").insert(payload).select().single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return fromRow(data as InternshipRow);
}

export async function updateInternship(
  id: string,
  input: InternshipInput,
): Promise<InternshipItem> {
  const payload = {
    title: input.title,
    organization: input.organization,
    description: input.description,
    registration_link: input.registrationLink,
    deadline: input.deadline,
    tags: input.tags,
    posted_by_email: input.postedByEmail,
  };

  const { data, error } = await supabase
    .from("internships")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  _cache = null;
  notifyChanged();
  return fromRow(data as InternshipRow);
}

export async function removeInternship(id: string) {
  const { error } = await supabase.from("internships").delete().eq("id", id);
  if (error) throw error;
  _cache = null;
  notifyChanged();
}

export function seedLocalInternshipsForMigration() {
  return DEFAULT_INTERNSHIPS.map(fromRow);
}

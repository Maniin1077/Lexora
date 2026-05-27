import logo from "@/assets/lexora-logo.jpg";
import { supabase } from "@/integrations/supabase/client";

export const SITE_CONTENT_KEY = "lexora.site-content";
export const SITE_CONTENT_CHANGED_EVENT = "lexora:site-content-changed";

export type PageHeroKey =
  | "about"
  | "activities"
  | "members"
  | "internships"
  | "magazines"
  | "contact"
  | "profile";

export const PAGE_HERO_KEYS: PageHeroKey[] = [
  "about",
  "activities",
  "members",
  "internships",
  "magazines",
  "contact",
  "profile",
];

export const PAGE_HERO_LABELS: Record<PageHeroKey, string> = {
  about: "About",
  activities: "Activities",
  members: "Members",
  internships: "Internships",
  magazines: "Magazines",
  contact: "Contact",
  profile: "Profile",
};

export type NavLabelKey = Exclude<PageHeroKey, "profile">;

export const NAV_LABEL_KEYS: NavLabelKey[] = [
  "about",
  "activities",
  "members",
  "internships",
  "magazines",
  "contact",
];

export const NAV_LABEL_DEFAULTS: Record<NavLabelKey, string> = {
  about: "About",
  activities: "Activities",
  members: "Members",
  internships: "Internships",
  magazines: "Magazines",
  contact: "Contact",
};

export interface PageHeroContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export interface HomeHeroContent {
  motto: string;
  titleLineOne: string;
  titleAccent: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  image: string;
}

export interface ContactDetailsContent {
  email: string;
  secondaryEmailLabel: string;
  secondaryEmail: string;
  tertiaryEmailLabel: string;
  tertiaryEmail: string;
  linkedInUrl: string;
  linkedInLabel: string;
  instagramUrl: string;
  instagramLabel: string;
}

interface SiteContentStore {
  pageHeroes?: Partial<Record<PageHeroKey, PageHeroContent>>;
  homeHero?: Partial<HomeHeroContent>;
  navigationLabels?: Partial<Record<NavLabelKey, string>>;
  contactDetails?: Partial<ContactDetailsContent>;
}

export const PAGE_HERO_DEFAULTS: Record<PageHeroKey, PageHeroContent> = {
  about: {
    eyebrow: "About Us",
    title: "Knowledge through collective contribution.",
    subtitle:
      "Lexora was founded with a singular purpose - to maximise the spread of knowledge with minimal individual burden.",
  },
  activities: {
    eyebrow: "What We Do",
    title: "Our Activities",
    subtitle:
      "A wide range of academic and professional activities, designed to build knowledge and community simultaneously.",
  },
  members: {
    eyebrow: "The Team",
    title: "Founding & Core Members",
    subtitle:
      "The people building Lexora - bringing vision, voice and rigour to a growing community.",
  },
  internships: {
    eyebrow: "Opportunities",
    title: "Internships",
    subtitle:
      "Apply for open opportunities and track your status by clicking Mark Applied after submission.",
  },
  magazines: {
    eyebrow: "Opportunities",
    title: "Internship Magazines",
    subtitle:
      "Curated internship opportunities. Sign in to apply and track your applications.",
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "Contact Us",
    subtitle:
      "Questions, collaborations, or want to join the community? Reach out - we read every message.",
  },
  profile: {
    eyebrow: "Member Area",
    title: "My Profile",
    subtitle: "Your Lexora identity and application history.",
  },
};

export const HOME_HERO_DEFAULTS: HomeHeroContent = {
  motto: "Sa Vidya Ya Vimuktaye",
  titleLineOne: "Knowledge",
  titleAccent: "liberates.",
  description:
    "Lexora is a student-run, multidisciplinary community uniting law, management and allied domains - built on collective contribution and shared growth.",
  primaryCtaText: "Apply for Internship",
  secondaryCtaText: "Discover Lexora",
  image: logo,
};

export const CONTACT_DETAILS_DEFAULTS: ContactDetailsContent = {
  email: "lexora.community@gmail.com",
  secondaryEmailLabel: "Anadi Sahu",
  secondaryEmail: "anadisahu9926@gmail.com",
  tertiaryEmailLabel: "Mohith Reddy",
  tertiaryEmail: "mohithofficial8@gmail.com",
  linkedInUrl: "https://www.linkedin.com/company/lexora-community/",
  linkedInLabel: "Lexora Community",
  instagramUrl: "https://instagram.com",
  instagramLabel: "@lexora.community",
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.trim();
}

function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_CHANGED_EVENT));
}

function emptyStore(): SiteContentStore {
  return {};
}

function toStoreRow(contentKey: string, content: unknown) {
  return {
    content_key: contentKey,
    content,
    updated_at: new Date().toISOString(),
  };
}

let cache: SiteContentStore = emptyStore();
let hydrated = false;
let hydratePromise: Promise<void> | null = null;

async function hydrateSiteContent() {
  if (typeof window === "undefined") return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    const { data, error } = await supabase.from("site_content").select("*");
    if (error) {
      console.error("hydrateSiteContent error", error);
      hydrated = true;
      return;
    }

    const next: SiteContentStore = emptyStore();
    for (const row of data ?? []) {
      const key = String((row as { content_key?: string }).content_key ?? "");
      const content = (row as { content?: unknown }).content;
      if (!key) continue;

      if (key === "pageHeroes") next.pageHeroes = content as SiteContentStore["pageHeroes"];
      if (key === "homeHero") next.homeHero = content as SiteContentStore["homeHero"];
      if (key === "navigationLabels") next.navigationLabels = content as SiteContentStore["navigationLabels"];
      if (key === "contactDetails") next.contactDetails = content as SiteContentStore["contactDetails"];
    }

    cache = next;
    hydrated = true;
    dispatchChanged();
  })();

  return hydratePromise;
}

void hydrateSiteContent();

const siteContentChannel = typeof window === "undefined"
  ? null
  : supabase
      .channel("public:site_content")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, () => {
        void hydrateSiteContent();
      });

if (siteContentChannel) {
  void siteContentChannel.subscribe();
}

function readStore(): SiteContentStore {
  return cache;
}

async function persistStore(next: SiteContentStore) {
  if (typeof window === "undefined") return;
  cache = next;

  const rows = [
    next.pageHeroes ? toStoreRow("pageHeroes", next.pageHeroes) : null,
    next.homeHero ? toStoreRow("homeHero", next.homeHero) : null,
    next.navigationLabels ? toStoreRow("navigationLabels", next.navigationLabels) : null,
    next.contactDetails ? toStoreRow("contactDetails", next.contactDetails) : null,
  ].filter(Boolean) as Array<{ content_key: string; content: unknown; updated_at: string }>;

  const { error } = await supabase.from("site_content").upsert(rows);
  if (error) throw error;
  dispatchChanged();
}

export function getPageHeroContent(
  key: PageHeroKey,
  fallback?: PageHeroContent,
): PageHeroContent {
  const defaults = fallback ?? PAGE_HERO_DEFAULTS[key];
  const store = readStore();
  const override = store.pageHeroes?.[key];

  if (!override) {
    return defaults;
  }

  return {
    eyebrow: normalizeText(override.eyebrow) || defaults.eyebrow,
    title: normalizeText(override.title) || defaults.title,
    subtitle: normalizeText(override.subtitle) || defaults.subtitle,
  };
}

export function setPageHeroContent(key: PageHeroKey, content: PageHeroContent) {
  const store = readStore();
  const pageHeroes = {
    ...(store.pageHeroes ?? {}),
    [key]: {
      eyebrow: normalizeText(content.eyebrow) || "",
      title: normalizeText(content.title) || PAGE_HERO_DEFAULTS[key].title,
      subtitle: normalizeText(content.subtitle) || "",
    },
  };

  void persistStore({ ...store, pageHeroes });
}

export function resetPageHeroContent(key: PageHeroKey) {
  const store = readStore();
  const pageHeroes = { ...(store.pageHeroes ?? {}) };
  delete pageHeroes[key];
  void persistStore({ ...store, pageHeroes });
}

export function getHomeHeroContent(
  fallback: HomeHeroContent = HOME_HERO_DEFAULTS,
): HomeHeroContent {
  const store = readStore();
  const override = store.homeHero;

  if (!override) {
    return fallback;
  }

  return {
    motto: normalizeText(override.motto) || fallback.motto,
    titleLineOne: normalizeText(override.titleLineOne) || fallback.titleLineOne,
    titleAccent: normalizeText(override.titleAccent) || fallback.titleAccent,
    description: normalizeText(override.description) || fallback.description,
    primaryCtaText:
      normalizeText(override.primaryCtaText) || fallback.primaryCtaText,
    secondaryCtaText:
      normalizeText(override.secondaryCtaText) || fallback.secondaryCtaText,
    image: normalizeText(override.image) || fallback.image,
  };
}

export function setHomeHeroContent(content: HomeHeroContent) {
  const store = readStore();
  const homeHero: HomeHeroContent = {
    motto: normalizeText(content.motto) || HOME_HERO_DEFAULTS.motto,
    titleLineOne:
      normalizeText(content.titleLineOne) || HOME_HERO_DEFAULTS.titleLineOne,
    titleAccent: normalizeText(content.titleAccent) || HOME_HERO_DEFAULTS.titleAccent,
    description:
      normalizeText(content.description) || HOME_HERO_DEFAULTS.description,
    primaryCtaText:
      normalizeText(content.primaryCtaText) || HOME_HERO_DEFAULTS.primaryCtaText,
    secondaryCtaText:
      normalizeText(content.secondaryCtaText) || HOME_HERO_DEFAULTS.secondaryCtaText,
    image: normalizeText(content.image) || HOME_HERO_DEFAULTS.image,
  };

  void persistStore({ ...store, homeHero });
}

export function resetHomeHeroContent() {
  const store = readStore();
  const next = { ...store };
  delete next.homeHero;
  void persistStore(next);
}

export function getNavigationLabels(
  fallback: Record<NavLabelKey, string> = NAV_LABEL_DEFAULTS,
): Record<NavLabelKey, string> {
  const store = readStore();
  const override = store.navigationLabels;

  if (!override) {
    return fallback;
  }

  const next = {} as Record<NavLabelKey, string>;
  for (const key of NAV_LABEL_KEYS) {
    next[key] = normalizeText(override[key]) || fallback[key];
  }

  return next;
}

export function setNavigationLabels(labels: Record<NavLabelKey, string>) {
  const store = readStore();
  const navigationLabels = {} as Record<NavLabelKey, string>;

  for (const key of NAV_LABEL_KEYS) {
    navigationLabels[key] = normalizeText(labels[key]) || NAV_LABEL_DEFAULTS[key];
  }

  void persistStore({ ...store, navigationLabels });
}

export function resetNavigationLabels() {
  const store = readStore();
  const next = { ...store };
  delete next.navigationLabels;
  void persistStore(next);
}

export function getContactDetails(
  fallback: ContactDetailsContent = CONTACT_DETAILS_DEFAULTS,
): ContactDetailsContent {
  const store = readStore();
  const override = store.contactDetails;

  if (!override) {
    return fallback;
  }

  return {
    email: normalizeText(override.email) || fallback.email,
    secondaryEmailLabel:
      normalizeText(override.secondaryEmailLabel) || fallback.secondaryEmailLabel,
    secondaryEmail:
      normalizeText(override.secondaryEmail) || fallback.secondaryEmail,
    tertiaryEmailLabel:
      normalizeText(override.tertiaryEmailLabel) || fallback.tertiaryEmailLabel,
    tertiaryEmail:
      normalizeText(override.tertiaryEmail) || fallback.tertiaryEmail,
    linkedInUrl: normalizeText(override.linkedInUrl) || fallback.linkedInUrl,
    linkedInLabel: normalizeText(override.linkedInLabel) || fallback.linkedInLabel,
    instagramUrl: normalizeText(override.instagramUrl) || fallback.instagramUrl,
    instagramLabel:
      normalizeText(override.instagramLabel) || fallback.instagramLabel,
  };
}

export function setContactDetails(content: ContactDetailsContent) {
  const store = readStore();
  const contactDetails: ContactDetailsContent = {
    email: normalizeText(content.email) || CONTACT_DETAILS_DEFAULTS.email,
    secondaryEmailLabel:
      normalizeText(content.secondaryEmailLabel) ||
      CONTACT_DETAILS_DEFAULTS.secondaryEmailLabel,
    secondaryEmail:
      normalizeText(content.secondaryEmail) ||
      CONTACT_DETAILS_DEFAULTS.secondaryEmail,
    tertiaryEmailLabel:
      normalizeText(content.tertiaryEmailLabel) ||
      CONTACT_DETAILS_DEFAULTS.tertiaryEmailLabel,
    tertiaryEmail:
      normalizeText(content.tertiaryEmail) ||
      CONTACT_DETAILS_DEFAULTS.tertiaryEmail,
    linkedInUrl:
      normalizeText(content.linkedInUrl) || CONTACT_DETAILS_DEFAULTS.linkedInUrl,
    linkedInLabel:
      normalizeText(content.linkedInLabel) || CONTACT_DETAILS_DEFAULTS.linkedInLabel,
    instagramUrl:
      normalizeText(content.instagramUrl) || CONTACT_DETAILS_DEFAULTS.instagramUrl,
    instagramLabel:
      normalizeText(content.instagramLabel) || CONTACT_DETAILS_DEFAULTS.instagramLabel,
  };

  void persistStore({ ...store, contactDetails });
}

export function resetContactDetails() {
  const store = readStore();
  const next = { ...store };
  delete next.contactDetails;
  void persistStore(next);
}

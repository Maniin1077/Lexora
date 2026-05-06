import logo from "@/assets/lexora-logo.jpg";

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

function readStore(): SiteContentStore {
  if (typeof window === "undefined") return {};
  return safeParse<SiteContentStore>(localStorage.getItem(SITE_CONTENT_KEY), {});
}

function writeStore(store: SiteContentStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_CHANGED_EVENT));
}

function cleanText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.trim();
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
    eyebrow: cleanText(override.eyebrow) || defaults.eyebrow,
    title: cleanText(override.title) || defaults.title,
    subtitle: cleanText(override.subtitle) || defaults.subtitle,
  };
}

export function setPageHeroContent(key: PageHeroKey, content: PageHeroContent) {
  const store = readStore();
  const pageHeroes = {
    ...(store.pageHeroes ?? {}),
    [key]: {
      eyebrow: cleanText(content.eyebrow) || "",
      title: cleanText(content.title) || PAGE_HERO_DEFAULTS[key].title,
      subtitle: cleanText(content.subtitle) || "",
    },
  };

  writeStore({ ...store, pageHeroes });
}

export function resetPageHeroContent(key: PageHeroKey) {
  const store = readStore();
  const pageHeroes = { ...(store.pageHeroes ?? {}) };
  delete pageHeroes[key];
  writeStore({ ...store, pageHeroes });
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
    motto: cleanText(override.motto) || fallback.motto,
    titleLineOne: cleanText(override.titleLineOne) || fallback.titleLineOne,
    titleAccent: cleanText(override.titleAccent) || fallback.titleAccent,
    description: cleanText(override.description) || fallback.description,
    primaryCtaText:
      cleanText(override.primaryCtaText) || fallback.primaryCtaText,
    secondaryCtaText:
      cleanText(override.secondaryCtaText) || fallback.secondaryCtaText,
    image: cleanText(override.image) || fallback.image,
  };
}

export function setHomeHeroContent(content: HomeHeroContent) {
  const store = readStore();
  const homeHero: HomeHeroContent = {
    motto: cleanText(content.motto) || HOME_HERO_DEFAULTS.motto,
    titleLineOne:
      cleanText(content.titleLineOne) || HOME_HERO_DEFAULTS.titleLineOne,
    titleAccent: cleanText(content.titleAccent) || HOME_HERO_DEFAULTS.titleAccent,
    description:
      cleanText(content.description) || HOME_HERO_DEFAULTS.description,
    primaryCtaText:
      cleanText(content.primaryCtaText) || HOME_HERO_DEFAULTS.primaryCtaText,
    secondaryCtaText:
      cleanText(content.secondaryCtaText) || HOME_HERO_DEFAULTS.secondaryCtaText,
    image: cleanText(content.image) || HOME_HERO_DEFAULTS.image,
  };

  writeStore({ ...store, homeHero });
}

export function resetHomeHeroContent() {
  const store = readStore();
  const next = { ...store };
  delete next.homeHero;
  writeStore(next);
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
    next[key] = cleanText(override[key]) || fallback[key];
  }

  return next;
}

export function setNavigationLabels(labels: Record<NavLabelKey, string>) {
  const store = readStore();
  const navigationLabels = {} as Record<NavLabelKey, string>;

  for (const key of NAV_LABEL_KEYS) {
    navigationLabels[key] = cleanText(labels[key]) || NAV_LABEL_DEFAULTS[key];
  }

  writeStore({ ...store, navigationLabels });
}

export function resetNavigationLabels() {
  const store = readStore();
  const next = { ...store };
  delete next.navigationLabels;
  writeStore(next);
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
    email: cleanText(override.email) || fallback.email,
    secondaryEmailLabel:
      cleanText(override.secondaryEmailLabel) || fallback.secondaryEmailLabel,
    secondaryEmail:
      cleanText(override.secondaryEmail) || fallback.secondaryEmail,
    tertiaryEmailLabel:
      cleanText(override.tertiaryEmailLabel) || fallback.tertiaryEmailLabel,
    tertiaryEmail:
      cleanText(override.tertiaryEmail) || fallback.tertiaryEmail,
    linkedInUrl: cleanText(override.linkedInUrl) || fallback.linkedInUrl,
    linkedInLabel: cleanText(override.linkedInLabel) || fallback.linkedInLabel,
    instagramUrl: cleanText(override.instagramUrl) || fallback.instagramUrl,
    instagramLabel:
      cleanText(override.instagramLabel) || fallback.instagramLabel,
  };
}

export function setContactDetails(content: ContactDetailsContent) {
  const store = readStore();
  const contactDetails: ContactDetailsContent = {
    email: cleanText(content.email) || CONTACT_DETAILS_DEFAULTS.email,
    secondaryEmailLabel:
      cleanText(content.secondaryEmailLabel) ||
      CONTACT_DETAILS_DEFAULTS.secondaryEmailLabel,
    secondaryEmail:
      cleanText(content.secondaryEmail) ||
      CONTACT_DETAILS_DEFAULTS.secondaryEmail,
    tertiaryEmailLabel:
      cleanText(content.tertiaryEmailLabel) ||
      CONTACT_DETAILS_DEFAULTS.tertiaryEmailLabel,
    tertiaryEmail:
      cleanText(content.tertiaryEmail) ||
      CONTACT_DETAILS_DEFAULTS.tertiaryEmail,
    linkedInUrl:
      cleanText(content.linkedInUrl) || CONTACT_DETAILS_DEFAULTS.linkedInUrl,
    linkedInLabel:
      cleanText(content.linkedInLabel) || CONTACT_DETAILS_DEFAULTS.linkedInLabel,
    instagramUrl:
      cleanText(content.instagramUrl) || CONTACT_DETAILS_DEFAULTS.instagramUrl,
    instagramLabel:
      cleanText(content.instagramLabel) || CONTACT_DETAILS_DEFAULTS.instagramLabel,
  };

  writeStore({ ...store, contactDetails });
}

export function resetContactDetails() {
  const store = readStore();
  const next = { ...store };
  delete next.contactDetails;
  writeStore(next);
}

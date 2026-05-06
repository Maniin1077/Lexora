import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-Bz0pR_Ai.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as User, u as LogOut, X, v as Menu, M as Mail, d as Linkedin, I as Instagram, w as Bell } from "../_libs/lucide-react.mjs";
const logo = "/assets/lexora-logo-CwczihNB.jpg";
const SITE_CONTENT_KEY = "lexora.site-content";
const SITE_CONTENT_CHANGED_EVENT = "lexora:site-content-changed";
const PAGE_HERO_KEYS = [
  "about",
  "activities",
  "members",
  "internships",
  "magazines",
  "contact",
  "profile"
];
const PAGE_HERO_LABELS = {
  about: "About",
  activities: "Activities",
  members: "Members",
  internships: "Internships",
  magazines: "Magazines",
  contact: "Contact",
  profile: "Profile"
};
const NAV_LABEL_KEYS = [
  "about",
  "activities",
  "members",
  "internships",
  "magazines",
  "contact"
];
const NAV_LABEL_DEFAULTS = {
  about: "About",
  activities: "Activities",
  members: "Members",
  internships: "Internships",
  magazines: "Magazines",
  contact: "Contact"
};
const PAGE_HERO_DEFAULTS = {
  about: {
    eyebrow: "About Us",
    title: "Knowledge through collective contribution.",
    subtitle: "Lexora was founded with a singular purpose - to maximise the spread of knowledge with minimal individual burden."
  },
  activities: {
    eyebrow: "What We Do",
    title: "Our Activities",
    subtitle: "A wide range of academic and professional activities, designed to build knowledge and community simultaneously."
  },
  members: {
    eyebrow: "The Team",
    title: "Founding & Core Members",
    subtitle: "The people building Lexora - bringing vision, voice and rigour to a growing community."
  },
  internships: {
    eyebrow: "Opportunities",
    title: "Internships",
    subtitle: "Apply for open opportunities and track your status by clicking Mark Applied after submission."
  },
  magazines: {
    eyebrow: "Opportunities",
    title: "Internship Magazines",
    subtitle: "Curated internship opportunities. Sign in to apply and track your applications."
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "Contact Us",
    subtitle: "Questions, collaborations, or want to join the community? Reach out - we read every message."
  },
  profile: {
    eyebrow: "Member Area",
    title: "My Profile",
    subtitle: "Your Lexora identity and application history."
  }
};
const HOME_HERO_DEFAULTS = {
  motto: "Sa Vidya Ya Vimuktaye",
  titleLineOne: "Knowledge",
  titleAccent: "liberates.",
  description: "Lexora is a student-run, multidisciplinary community uniting law, management and allied domains - built on collective contribution and shared growth.",
  primaryCtaText: "Apply for Internship",
  secondaryCtaText: "Discover Lexora",
  image: logo
};
const CONTACT_DETAILS_DEFAULTS = {
  email: "lexora.community@gmail.com",
  secondaryEmailLabel: "Anadi Sahu",
  secondaryEmail: "anadisahu9926@gmail.com",
  tertiaryEmailLabel: "Mohith Reddy",
  tertiaryEmail: "mohithofficial8@gmail.com",
  linkedInUrl: "https://www.linkedin.com/company/lexora-community/",
  linkedInLabel: "Lexora Community",
  instagramUrl: "https://instagram.com",
  instagramLabel: "@lexora.community"
};
function safeParse$1(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function readStore() {
  if (typeof window === "undefined") return {};
  return safeParse$1(localStorage.getItem(SITE_CONTENT_KEY), {});
}
function writeStore(store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_CHANGED_EVENT));
}
function cleanText(value) {
  if (value === void 0) return void 0;
  return value.trim();
}
function getPageHeroContent(key, fallback) {
  const defaults = fallback ?? PAGE_HERO_DEFAULTS[key];
  const store = readStore();
  const override = store.pageHeroes?.[key];
  if (!override) {
    return defaults;
  }
  return {
    eyebrow: cleanText(override.eyebrow) || defaults.eyebrow,
    title: cleanText(override.title) || defaults.title,
    subtitle: cleanText(override.subtitle) || defaults.subtitle
  };
}
function setPageHeroContent(key, content) {
  const store = readStore();
  const pageHeroes = {
    ...store.pageHeroes ?? {},
    [key]: {
      eyebrow: cleanText(content.eyebrow) || "",
      title: cleanText(content.title) || PAGE_HERO_DEFAULTS[key].title,
      subtitle: cleanText(content.subtitle) || ""
    }
  };
  writeStore({ ...store, pageHeroes });
}
function resetPageHeroContent(key) {
  const store = readStore();
  const pageHeroes = { ...store.pageHeroes ?? {} };
  delete pageHeroes[key];
  writeStore({ ...store, pageHeroes });
}
function getHomeHeroContent(fallback = HOME_HERO_DEFAULTS) {
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
    primaryCtaText: cleanText(override.primaryCtaText) || fallback.primaryCtaText,
    secondaryCtaText: cleanText(override.secondaryCtaText) || fallback.secondaryCtaText,
    image: cleanText(override.image) || fallback.image
  };
}
function setHomeHeroContent(content) {
  const store = readStore();
  const homeHero = {
    motto: cleanText(content.motto) || HOME_HERO_DEFAULTS.motto,
    titleLineOne: cleanText(content.titleLineOne) || HOME_HERO_DEFAULTS.titleLineOne,
    titleAccent: cleanText(content.titleAccent) || HOME_HERO_DEFAULTS.titleAccent,
    description: cleanText(content.description) || HOME_HERO_DEFAULTS.description,
    primaryCtaText: cleanText(content.primaryCtaText) || HOME_HERO_DEFAULTS.primaryCtaText,
    secondaryCtaText: cleanText(content.secondaryCtaText) || HOME_HERO_DEFAULTS.secondaryCtaText,
    image: cleanText(content.image) || HOME_HERO_DEFAULTS.image
  };
  writeStore({ ...store, homeHero });
}
function resetHomeHeroContent() {
  const store = readStore();
  const next = { ...store };
  delete next.homeHero;
  writeStore(next);
}
function getNavigationLabels(fallback = NAV_LABEL_DEFAULTS) {
  const store = readStore();
  const override = store.navigationLabels;
  if (!override) {
    return fallback;
  }
  const next = {};
  for (const key of NAV_LABEL_KEYS) {
    next[key] = cleanText(override[key]) || fallback[key];
  }
  return next;
}
function setNavigationLabels(labels) {
  const store = readStore();
  const navigationLabels = {};
  for (const key of NAV_LABEL_KEYS) {
    navigationLabels[key] = cleanText(labels[key]) || NAV_LABEL_DEFAULTS[key];
  }
  writeStore({ ...store, navigationLabels });
}
function resetNavigationLabels() {
  const store = readStore();
  const next = { ...store };
  delete next.navigationLabels;
  writeStore(next);
}
function getContactDetails(fallback = CONTACT_DETAILS_DEFAULTS) {
  const store = readStore();
  const override = store.contactDetails;
  if (!override) {
    return fallback;
  }
  return {
    email: cleanText(override.email) || fallback.email,
    secondaryEmailLabel: cleanText(override.secondaryEmailLabel) || fallback.secondaryEmailLabel,
    secondaryEmail: cleanText(override.secondaryEmail) || fallback.secondaryEmail,
    tertiaryEmailLabel: cleanText(override.tertiaryEmailLabel) || fallback.tertiaryEmailLabel,
    tertiaryEmail: cleanText(override.tertiaryEmail) || fallback.tertiaryEmail,
    linkedInUrl: cleanText(override.linkedInUrl) || fallback.linkedInUrl,
    linkedInLabel: cleanText(override.linkedInLabel) || fallback.linkedInLabel,
    instagramUrl: cleanText(override.instagramUrl) || fallback.instagramUrl,
    instagramLabel: cleanText(override.instagramLabel) || fallback.instagramLabel
  };
}
function setContactDetails(content) {
  const store = readStore();
  const contactDetails = {
    email: cleanText(content.email) || CONTACT_DETAILS_DEFAULTS.email,
    secondaryEmailLabel: cleanText(content.secondaryEmailLabel) || CONTACT_DETAILS_DEFAULTS.secondaryEmailLabel,
    secondaryEmail: cleanText(content.secondaryEmail) || CONTACT_DETAILS_DEFAULTS.secondaryEmail,
    tertiaryEmailLabel: cleanText(content.tertiaryEmailLabel) || CONTACT_DETAILS_DEFAULTS.tertiaryEmailLabel,
    tertiaryEmail: cleanText(content.tertiaryEmail) || CONTACT_DETAILS_DEFAULTS.tertiaryEmail,
    linkedInUrl: cleanText(content.linkedInUrl) || CONTACT_DETAILS_DEFAULTS.linkedInUrl,
    linkedInLabel: cleanText(content.linkedInLabel) || CONTACT_DETAILS_DEFAULTS.linkedInLabel,
    instagramUrl: cleanText(content.instagramUrl) || CONTACT_DETAILS_DEFAULTS.instagramUrl,
    instagramLabel: cleanText(content.instagramLabel) || CONTACT_DETAILS_DEFAULTS.instagramLabel
  };
  writeStore({ ...store, contactDetails });
}
function resetContactDetails() {
  const store = readStore();
  const next = { ...store };
  delete next.contactDetails;
  writeStore(next);
}
const NOTIFICATIONS_KEY = "lexora.notifications";
const NOTIFICATIONS_CHANGED_EVENT = "lexora:notifications-changed";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function dispatchNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
}
function readNotifications() {
  if (typeof window === "undefined") return [];
  const raw = safeParse(
    localStorage.getItem(NOTIFICATIONS_KEY),
    []
  );
  const normalized = raw.map((item) => ({
    id: String(item.id ?? "").trim() || makeId(),
    targetEmail: item.targetEmail === null || item.targetEmail === void 0 ? null : normalizeEmail(String(item.targetEmail)),
    title: String(item.title ?? "").trim(),
    message: String(item.message ?? "").trim(),
    senderEmail: normalizeEmail(String(item.senderEmail ?? "")),
    createdAt: String(item.createdAt ?? "").trim() || (/* @__PURE__ */ new Date()).toISOString(),
    readBy: Array.isArray(item.readBy) ? item.readBy.map((email) => normalizeEmail(String(email))).filter(Boolean) : []
  })).filter((item) => item.title.length > 0 && item.message.length > 0);
  const needsRewrite = normalized.length !== raw.length || raw.some((item, index) => {
    const next = normalized[index];
    return !next || String(item.id ?? "") !== next.id || String(item.title ?? "").trim() !== next.title || String(item.message ?? "").trim() !== next.message || String(item.senderEmail ?? "").trim().toLowerCase() !== next.senderEmail || String(item.createdAt ?? "").trim() !== next.createdAt;
  });
  if (needsRewrite) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}
function writeNotifications(records) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(records));
  dispatchNotificationsChanged();
}
function normalizeTargetEmail(targetEmail) {
  if (targetEmail === null || targetEmail === void 0) return null;
  const normalized = normalizeEmail(targetEmail);
  return normalized.length > 0 ? normalized : null;
}
function createNotification(input) {
  if (typeof window === "undefined") return;
  const title = input.title.trim();
  const message = input.message.trim();
  const senderEmail = normalizeEmail(input.senderEmail);
  const targetEmail = normalizeTargetEmail(input.targetEmail ?? null);
  if (!title || !message || !senderEmail) {
    throw new Error("Notification title, message, and sender are required.");
  }
  const next = {
    id: makeId(),
    targetEmail,
    title,
    message,
    senderEmail,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    readBy: []
  };
  writeNotifications([next, ...readNotifications()]);
}
function getNotificationsForEmail(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  return readNotifications().filter((item) => item.targetEmail === null || item.targetEmail === normalized).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
function markNotificationsReadForEmail(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return;
  const records = readNotifications();
  let changed = false;
  const next = records.map((item) => {
    if (item.targetEmail !== null && item.targetEmail !== normalized) {
      return item;
    }
    if (item.readBy.includes(normalized)) {
      return item;
    }
    changed = true;
    return {
      ...item,
      readBy: [...item.readBy, normalized]
    };
  });
  if (changed) {
    writeNotifications(next);
  }
}
const nav = [
  { to: "/", label: "Home" },
  { to: "/about", key: "about" },
  { to: "/activities", key: "activities" },
  { to: "/members", key: "members" },
  { to: "/internships", key: "internships" },
  { to: "/magazines", key: "magazines" },
  { to: "/contact", key: "contact" }
];
function resolveNavLabel(item, labels) {
  if ("key" in item) {
    return labels[item.key];
  }
  return item.label;
}
function formatNotificationTime(value) {
  return new Date(value).toLocaleString();
}
function NotificationBellButton({
  unreadCount,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: "relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary transition hover:border-gold/60 hover:bg-gold/10",
      "aria-label": "Open notifications",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-red-500" })
      ]
    }
  );
}
function SiteHeader() {
  const [open, setOpen] = reactExports.useState(false);
  const [notificationsOpen, setNotificationsOpen] = reactExports.useState(false);
  const [navLabels, setNavLabels] = reactExports.useState(
    () => getNavigationLabels({ ...NAV_LABEL_DEFAULTS })
  );
  const { user, signOut, loading, isAdmin } = useAuth();
  const [notifications, setNotifications] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const load = () => setNavLabels(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));
    load();
    const onStorage = (event) => {
      if (event.key === null || event.key === SITE_CONTENT_KEY) {
        load();
      }
    };
    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, load);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, load);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  reactExports.useEffect(() => {
    const loadNotifications = () => setNotifications(getNotificationsForEmail(user?.email));
    loadNotifications();
    const onStorage = (event) => {
      if (event.key === null || event.key === "lexora.notifications") {
        loadNotifications();
      }
    };
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, loadNotifications);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, loadNotifications);
      window.removeEventListener("storage", onStorage);
    };
  }, [user?.email]);
  reactExports.useEffect(() => {
    if (!notificationsOpen || !user?.email) return;
    markNotificationsReadForEmail(user.email);
    setNotifications(getNotificationsForEmail(user.email));
  }, [notificationsOpen, user?.email]);
  const unreadCount = reactExports.useMemo(() => {
    if (!user?.email) return 0;
    const normalized = user.email.trim().toLowerCase();
    return notifications.filter((item) => !item.readBy.includes(normalized)).length;
  }, [notifications, user?.email]);
  const navItems = isAdmin ? [...nav, { to: "/admin", label: "Admin" }] : [...nav];
  const handleSignOut = async () => {
    try {
      setNotificationsOpen(false);
      await signOut();
      toast.success("Logout Successfully", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not log out", { description: message });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-20 max-w-7xl items-center gap-4 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logo,
            alt: "Lexora Community logo",
            className: "h-full w-full scale-[1.14] object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-semibold text-primary", children: "Lexora" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Sa Vidyā Ya Vimuktaye" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden min-w-0 flex-1 justify-center md:flex", children: !loading && user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-medium text-primary/90", children: [
        "Hey, ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          user.firstName,
          "!"
        ] })
      ] }) : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-6 md:ml-auto md:flex", children: [
        navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: item.to,
            className: "text-sm font-medium text-foreground/75 transition-colors hover:text-primary",
            activeProps: {
              className: "text-primary [&]:text-primary border-b-2 border-gold pb-1"
            },
            activeOptions: { exact: item.to === "/" },
            children: resolveNavLabel(item, navLabels)
          },
          item.to
        )),
        !loading && (user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NotificationBellButton,
            {
              unreadCount,
              onClick: () => setNotificationsOpen((prev) => !prev)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/profile",
              className: "flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-medium text-primary hover:bg-gold/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }),
                " Profile"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSignOut,
              className: "text-muted-foreground hover:text-primary",
              "aria-label": "Sign out",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            className: "rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90",
            children: "Sign In"
          }
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 md:hidden", children: [
        !loading && user && /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationBellButton,
          {
            unreadCount,
            onClick: () => setNotificationsOpen((prev) => !prev)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setOpen(!open),
            className: "text-primary",
            "aria-label": "Toggle menu",
            children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {})
          }
        )
      ] })
    ] }),
    notificationsOpen && user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-6 top-[4.8rem] z-50 w-[min(92vw,26rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: "Important Messages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-lg text-primary", children: "Notifications" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setNotificationsOpen(false),
            className: "rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-primary",
            "aria-label": "Close notifications",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] space-y-2 overflow-y-auto p-3", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground", children: "No important messages yet." }) : notifications.map((item) => {
        const unread = !item.readBy.includes(user.email.trim().toLowerCase());
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            className: `rounded-xl border p-4 transition ${unread ? "border-gold/40 bg-gold/5" : "border-border bg-card"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-medium text-primary", children: item.title }),
                  unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-red-500" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: item.message })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[11px] uppercase tracking-wide text-muted-foreground", children: formatNotificationTime(item.createdAt) })
            ]
          },
          item.id
        );
      }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-background md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col px-6 py-4", children: [
      navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: item.to,
          onClick: () => setOpen(false),
          className: "py-3 text-sm font-medium text-foreground/80",
          activeProps: { className: "text-primary" },
          activeOptions: { exact: item.to === "/" },
          children: resolveNavLabel(item, navLabels)
        },
        item.to
      )),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground", children: [
          "Hey, ",
          user.firstName,
          "!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/profile",
            onClick: () => setOpen(false),
            className: "py-3 text-sm font-medium text-primary",
            children: "My Profile"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: async () => {
              await handleSignOut();
              setOpen(false);
            },
            className: "py-3 text-left text-sm text-muted-foreground",
            children: "Sign out"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          onClick: () => setOpen(false),
          className: "py-3 text-sm font-medium text-primary",
          children: "Sign In"
        }
      )
    ] }) })
  ] });
}
function SiteFooter() {
  const { user } = useAuth();
  const [navLabels, setNavLabels] = reactExports.useState(
    () => getNavigationLabels({ ...NAV_LABEL_DEFAULTS })
  );
  const [contact, setContact] = reactExports.useState(
    () => getContactDetails({ ...CONTACT_DETAILS_DEFAULTS })
  );
  reactExports.useEffect(() => {
    const load = () => {
      setNavLabels(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));
      setContact(getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }));
    };
    load();
    const onStorage = (event) => {
      if (event.key === null || event.key === SITE_CONTENT_KEY) {
        load();
      }
    };
    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, load);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, load);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const requireLoginForExternal = (e, label) => {
    if (user) return;
    e.preventDefault();
    toast.error("Please sign in first", {
      description: `You must be logged in to open ${label}.`,
      action: {
        label: "Sign in",
        onClick: () => window.location.href = "/login"
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 bg-navy-deep text-primary-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: logo,
              alt: "Lexora",
              className: "h-full w-full scale-[1.14] object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl", children: "Lexora Community" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-gold", children: "Sa Vidyā Ya Vimuktaye" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/70", children: "A multidisciplinary ecosystem where students and young professionals from law, management, and allied domains come together to learn, grow, and elevate each other." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg text-gold", children: "Explore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-primary-foreground/75", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-gold", children: navLabels.about }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/activities", className: "hover:text-gold", children: navLabels.activities }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/members", className: "hover:text-gold", children: navLabels.members }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/internships", className: "hover:text-gold", children: navLabels.internships }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-gold", children: navLabels.contact }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg text-gold", children: "Connect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm text-primary-foreground/75", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${contact.email}`, className: "block hover:text-gold", children: contact.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${contact.secondaryEmail}`, className: "block hover:text-gold", children: [
              contact.secondaryEmailLabel,
              " - ",
              contact.secondaryEmail
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${contact.tertiaryEmail}`, className: "block hover:text-gold", children: [
              contact.tertiaryEmailLabel,
              " - ",
              contact.tertiaryEmail
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: contact.linkedInUrl,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => requireLoginForExternal(e, "LinkedIn"),
                className: "rounded-full border border-gold/40 p-2 transition hover:bg-gold hover:text-navy-deep",
                "aria-label": contact.linkedInLabel,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: contact.instagramUrl,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => requireLoginForExternal(e, "Instagram"),
                className: "rounded-full border border-gold/40 p-2 transition hover:bg-gold hover:text-navy-deep",
                "aria-label": contact.instagramLabel,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-primary-foreground/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Lexora Community. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold/80", children: "Website designed & developed by" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary-foreground", children: "Baratam Sri Manikanta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground/40", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "mailto:bsmanikanta2004@gmail.com",
            onClick: (e) => requireLoginForExternal(e, "email link"),
            className: "hover:text-gold",
            children: "bsmanikanta2004@gmail.com"
          }
        )
      ] })
    ] }) })
  ] });
}
function SiteLayout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  CONTACT_DETAILS_DEFAULTS as C,
  HOME_HERO_DEFAULTS as H,
  NAV_LABEL_DEFAULTS as N,
  PAGE_HERO_LABELS as P,
  SiteLayout as S,
  SITE_CONTENT_CHANGED_EVENT as a,
  SITE_CONTENT_KEY as b,
  getHomeHeroContent as c,
  getNavigationLabels as d,
  NAV_LABEL_KEYS as e,
  PAGE_HERO_KEYS as f,
  getContactDetails as g,
  getPageHeroContent as h,
  createNotification as i,
  setNavigationLabels as j,
  resetNavigationLabels as k,
  setContactDetails as l,
  resetContactDetails as m,
  setPageHeroContent as n,
  resetPageHeroContent as o,
  PAGE_HERO_DEFAULTS as p,
  logo as q,
  resetHomeHeroContent as r,
  setHomeHeroContent as s
};

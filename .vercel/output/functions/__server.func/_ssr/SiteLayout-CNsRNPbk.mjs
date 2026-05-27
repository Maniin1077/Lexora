import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-DqURmC3W.mjs";
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
function normalizeText(value) {
  if (value === void 0) return void 0;
  return value.trim();
}
function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SITE_CONTENT_CHANGED_EVENT));
}
function emptyStore() {
  return {};
}
function toStoreRow(contentKey, content) {
  return {
    content_key: contentKey,
    content,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
let cache = emptyStore();
let hydratePromise = null;
async function hydrateSiteContent() {
  if (typeof window === "undefined") return;
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    const { data, error } = await supabase.from("site_content").select("*");
    if (error) {
      console.error("hydrateSiteContent error", error);
      return;
    }
    const next = emptyStore();
    for (const row of data ?? []) {
      const key = String(row.content_key ?? "");
      const content = row.content;
      if (!key) continue;
      if (key === "pageHeroes") next.pageHeroes = content;
      if (key === "homeHero") next.homeHero = content;
      if (key === "navigationLabels") next.navigationLabels = content;
      if (key === "contactDetails") next.contactDetails = content;
    }
    cache = next;
    dispatchChanged();
  })();
  return hydratePromise;
}
void hydrateSiteContent();
const siteContentChannel = typeof window === "undefined" ? null : supabase.channel("public:site_content").on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, () => {
  void hydrateSiteContent();
});
if (siteContentChannel) {
  void siteContentChannel.subscribe();
}
function readStore() {
  return cache;
}
async function persistStore(next) {
  if (typeof window === "undefined") return;
  cache = next;
  const rows = [
    next.pageHeroes ? toStoreRow("pageHeroes", next.pageHeroes) : null,
    next.homeHero ? toStoreRow("homeHero", next.homeHero) : null,
    next.navigationLabels ? toStoreRow("navigationLabels", next.navigationLabels) : null,
    next.contactDetails ? toStoreRow("contactDetails", next.contactDetails) : null
  ].filter(Boolean);
  const { error } = await supabase.from("site_content").upsert(rows);
  if (error) throw error;
  dispatchChanged();
}
function getPageHeroContent(key, fallback) {
  const defaults = fallback ?? PAGE_HERO_DEFAULTS[key];
  const store = readStore();
  const override = store.pageHeroes?.[key];
  if (!override) {
    return defaults;
  }
  return {
    eyebrow: normalizeText(override.eyebrow) || defaults.eyebrow,
    title: normalizeText(override.title) || defaults.title,
    subtitle: normalizeText(override.subtitle) || defaults.subtitle
  };
}
function setPageHeroContent(key, content) {
  const store = readStore();
  const pageHeroes = {
    ...store.pageHeroes ?? {},
    [key]: {
      eyebrow: normalizeText(content.eyebrow) || "",
      title: normalizeText(content.title) || PAGE_HERO_DEFAULTS[key].title,
      subtitle: normalizeText(content.subtitle) || ""
    }
  };
  void persistStore({ ...store, pageHeroes });
}
function resetPageHeroContent(key) {
  const store = readStore();
  const pageHeroes = { ...store.pageHeroes ?? {} };
  delete pageHeroes[key];
  void persistStore({ ...store, pageHeroes });
}
function getHomeHeroContent(fallback = HOME_HERO_DEFAULTS) {
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
    primaryCtaText: normalizeText(override.primaryCtaText) || fallback.primaryCtaText,
    secondaryCtaText: normalizeText(override.secondaryCtaText) || fallback.secondaryCtaText,
    image: normalizeText(override.image) || fallback.image
  };
}
function setHomeHeroContent(content) {
  const store = readStore();
  const homeHero = {
    motto: normalizeText(content.motto) || HOME_HERO_DEFAULTS.motto,
    titleLineOne: normalizeText(content.titleLineOne) || HOME_HERO_DEFAULTS.titleLineOne,
    titleAccent: normalizeText(content.titleAccent) || HOME_HERO_DEFAULTS.titleAccent,
    description: normalizeText(content.description) || HOME_HERO_DEFAULTS.description,
    primaryCtaText: normalizeText(content.primaryCtaText) || HOME_HERO_DEFAULTS.primaryCtaText,
    secondaryCtaText: normalizeText(content.secondaryCtaText) || HOME_HERO_DEFAULTS.secondaryCtaText,
    image: normalizeText(content.image) || HOME_HERO_DEFAULTS.image
  };
  void persistStore({ ...store, homeHero });
}
function resetHomeHeroContent() {
  const store = readStore();
  const next = { ...store };
  delete next.homeHero;
  void persistStore(next);
}
function getNavigationLabels(fallback = NAV_LABEL_DEFAULTS) {
  const store = readStore();
  const override = store.navigationLabels;
  if (!override) {
    return fallback;
  }
  const next = {};
  for (const key of NAV_LABEL_KEYS) {
    next[key] = normalizeText(override[key]) || fallback[key];
  }
  return next;
}
function setNavigationLabels(labels) {
  const store = readStore();
  const navigationLabels = {};
  for (const key of NAV_LABEL_KEYS) {
    navigationLabels[key] = normalizeText(labels[key]) || NAV_LABEL_DEFAULTS[key];
  }
  void persistStore({ ...store, navigationLabels });
}
function resetNavigationLabels() {
  const store = readStore();
  const next = { ...store };
  delete next.navigationLabels;
  void persistStore(next);
}
function getContactDetails(fallback = CONTACT_DETAILS_DEFAULTS) {
  const store = readStore();
  const override = store.contactDetails;
  if (!override) {
    return fallback;
  }
  return {
    email: normalizeText(override.email) || fallback.email,
    secondaryEmailLabel: normalizeText(override.secondaryEmailLabel) || fallback.secondaryEmailLabel,
    secondaryEmail: normalizeText(override.secondaryEmail) || fallback.secondaryEmail,
    tertiaryEmailLabel: normalizeText(override.tertiaryEmailLabel) || fallback.tertiaryEmailLabel,
    tertiaryEmail: normalizeText(override.tertiaryEmail) || fallback.tertiaryEmail,
    linkedInUrl: normalizeText(override.linkedInUrl) || fallback.linkedInUrl,
    linkedInLabel: normalizeText(override.linkedInLabel) || fallback.linkedInLabel,
    instagramUrl: normalizeText(override.instagramUrl) || fallback.instagramUrl,
    instagramLabel: normalizeText(override.instagramLabel) || fallback.instagramLabel
  };
}
function setContactDetails(content) {
  const store = readStore();
  const contactDetails = {
    email: normalizeText(content.email) || CONTACT_DETAILS_DEFAULTS.email,
    secondaryEmailLabel: normalizeText(content.secondaryEmailLabel) || CONTACT_DETAILS_DEFAULTS.secondaryEmailLabel,
    secondaryEmail: normalizeText(content.secondaryEmail) || CONTACT_DETAILS_DEFAULTS.secondaryEmail,
    tertiaryEmailLabel: normalizeText(content.tertiaryEmailLabel) || CONTACT_DETAILS_DEFAULTS.tertiaryEmailLabel,
    tertiaryEmail: normalizeText(content.tertiaryEmail) || CONTACT_DETAILS_DEFAULTS.tertiaryEmail,
    linkedInUrl: normalizeText(content.linkedInUrl) || CONTACT_DETAILS_DEFAULTS.linkedInUrl,
    linkedInLabel: normalizeText(content.linkedInLabel) || CONTACT_DETAILS_DEFAULTS.linkedInLabel,
    instagramUrl: normalizeText(content.instagramUrl) || CONTACT_DETAILS_DEFAULTS.instagramUrl,
    instagramLabel: normalizeText(content.instagramLabel) || CONTACT_DETAILS_DEFAULTS.instagramLabel
  };
  void persistStore({ ...store, contactDetails });
}
function resetContactDetails() {
  const store = readStore();
  const next = { ...store };
  delete next.contactDetails;
  void persistStore(next);
}
const NOTIFICATIONS_CHANGED_EVENT = "lexora:notifications-changed";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function dispatchNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
}
function toRow(record) {
  return {
    id: record.id,
    target_email: record.targetEmail,
    title: record.title,
    message: record.message,
    sender_email: record.senderEmail,
    created_at: record.createdAt,
    read_by: record.readBy
  };
}
function fromRow(row) {
  return {
    id: row.id,
    targetEmail: row.target_email,
    title: row.title,
    message: row.message,
    senderEmail: row.sender_email,
    createdAt: row.created_at,
    readBy: row.read_by ?? []
  };
}
async function createNotification(input) {
  const title = input.title.trim();
  const message = input.message.trim();
  const senderEmail = normalizeEmail(input.senderEmail);
  const targetEmail = input.targetEmail ? normalizeEmail(input.targetEmail) : null;
  if (!title || !message || !senderEmail) {
    throw new Error("Notification title, message, and sender are required.");
  }
  const payload = toRow({
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    targetEmail,
    title,
    message,
    senderEmail,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    readBy: []
  });
  const { error } = await supabase.from("notifications").insert(payload);
  if (error) throw error;
  dispatchNotificationsChanged();
}
async function getNotificationsForEmail(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  const { data, error } = await supabase.from("notifications").select("*").or(`target_email.is.null,target_email.eq.${normalized}`).order("created_at", { ascending: false });
  if (error) {
    console.error("getNotificationsForEmail error", error);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row));
}
async function getUnreadNotificationsForEmail(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];
  const all = await getNotificationsForEmail(normalized);
  return all.filter((item) => !item.readBy.includes(normalized));
}
async function markNotificationsReadForEmail(email) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return;
  const unread = await getUnreadNotificationsForEmail(normalized);
  for (const item of unread) {
    const nextReadBy = Array.from(/* @__PURE__ */ new Set([...item.readBy, normalized]));
    const { error } = await supabase.from("notifications").update({ read_by: nextReadBy }).eq("id", item.id);
    if (error) throw error;
  }
  dispatchNotificationsChanged();
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
    const loadNotifications = () => {
      void getNotificationsForEmail(user?.email).then(setNotifications);
    };
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
    void markNotificationsReadForEmail(user.email);
    void getNotificationsForEmail(user.email).then(setNotifications);
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

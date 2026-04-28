import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as getHomeHeroContent, H as HOME_HERO_DEFAULTS, d as getNavigationLabels, N as NAV_LABEL_DEFAULTS, g as getContactDetails, C as CONTACT_DETAILS_DEFAULTS, a as SITE_CONTENT_CHANGED_EVENT, S as SiteLayout, e as NAV_LABEL_KEYS, P as PAGE_HERO_LABELS, f as PAGE_HERO_KEYS, h as getPageHeroContent, b as SITE_CONTENT_KEY, s as setHomeHeroContent, r as resetHomeHeroContent, i as setNavigationLabels, j as resetNavigationLabels, k as setContactDetails, l as resetContactDetails, m as setPageHeroContent, n as resetPageHeroContent, o as PAGE_HERO_DEFAULTS } from "./SiteLayout-Dt65AXE2.mjs";
import { u as useAuth, A as AUTH_CHANGED_EVENT, M as MAX_ADMINS, g as getUserRole, S as SYSTEM_ADMIN_EMAIL, a as getAllUsersForAdmin, b as AUTH_ACCOUNTS_KEY, c as AUTH_ADMIN_EMAILS_KEY } from "./router-B3jH0kL-.mjs";
import { A as APPLIED_CHANGED_EVENT, a as getApplicationSummary, b as APPLIED_KEY_PREFIX } from "./applications-CxYEjjqA.mjs";
import { C as CHANGE_LOG_CHANGED_EVENT, g as getVisibleChangeLogsForRole, a as CHANGE_LOG_KEY, l as logChange } from "./change-log-C_6h4jB_.mjs";
import { I as INTERNSHIPS_CHANGED_EVENT, g as getInternships, a as INTERNSHIPS_KEY } from "./internships-CpXYNrCW.mjs";
import { M as MAGAZINES_CHANGED_EVENT, g as getMagazines, a as MAGAZINES_KEY } from "./magazines-D21PTWll.mjs";
import { M as MEMBERS_CHANGED_EVENT, g as getMembers, a as MEMBERS_KEY } from "./members-D_f15q36.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as Users, S as ShieldCheck, B as BookUser, f as BriefcaseBusiness, N as Newspaper, g as BadgeCheck, h as Clock3, i as UserPlus, j as Sparkles, k as Image, R as RefreshCcw } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const LIVE_REFRESH_MS = 1500;
function buildPageHeroForms() {
  const forms = {};
  for (const key of PAGE_HERO_KEYS) {
    forms[key] = getPageHeroContent(key, PAGE_HERO_DEFAULTS[key]);
  }
  return forms;
}
function formatAction(action) {
  switch (action) {
    case "member.add":
      return "Member added";
    case "member.update":
      return "Member updated";
    case "member.remove":
      return "Member removed";
    case "internship.add":
      return "Internship added";
    case "internship.update":
      return "Internship updated";
    case "internship.remove":
      return "Internship removed";
    case "magazine.add":
      return "Magazine added";
    case "magazine.update":
      return "Magazine updated";
    case "magazine.remove":
      return "Magazine removed";
    case "site.page.update":
      return "Page content updated";
    case "site.page.reset":
      return "Page content reset";
    case "site.home.update":
      return "Home content updated";
    case "site.home.reset":
      return "Home content reset";
    case "owner.grant":
      return "Owner access granted";
    case "owner.revoke":
      return "Owner access revoked";
    case "admin.grant":
      return "Admin access granted";
    case "admin.revoke":
      return "Admin access revoked";
    default:
      return action;
  }
}
function collectStats(role, adminCount, managedAdminCount) {
  const users = getAllUsersForAdmin();
  const summary = getApplicationSummary();
  const logs = getVisibleChangeLogsForRole(role);
  return {
    users,
    logs,
    stats: {
      usersTotal: users.length,
      adminsTotal: adminCount,
      managedAdmins: managedAdminCount,
      membersTotal: getMembers().length,
      internshipsTotal: getInternships().length,
      magazinesTotal: getMagazines().length,
      usersAppliedInternships: summary.usersAppliedInternships,
      usersAppliedMagazines: summary.usersAppliedMagazines,
      totalInternshipApplications: summary.totalInternshipApplications,
      totalMagazineApplications: summary.totalMagazineApplications,
      visibleChanges: logs.length
    }
  };
}
function AdminPage() {
  const {
    user,
    loading,
    role,
    isAdmin,
    isOwner,
    adminEmails,
    managedAdminEmails,
    ownerEmails,
    grantAdminAccess,
    revokeAdminAccess,
    grantOwnerAccess,
    revokeOwnerAccess
  } = useAuth();
  const navigate = useNavigate();
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";
  const [users, setUsers] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState({
    usersTotal: 0,
    adminsTotal: 0,
    managedAdmins: 0,
    membersTotal: 0,
    internshipsTotal: 0,
    magazinesTotal: 0,
    usersAppliedInternships: 0,
    usersAppliedMagazines: 0,
    totalInternshipApplications: 0,
    totalMagazineApplications: 0,
    visibleChanges: 0
  });
  const [logs, setLogs] = reactExports.useState([]);
  const [lastRefreshedAt, setLastRefreshedAt] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString());
  const [grantAdminEmail, setGrantAdminEmail] = reactExports.useState("");
  const [grantingAdmin, setGrantingAdmin] = reactExports.useState(false);
  const [revokingAdminEmail, setRevokingAdminEmail] = reactExports.useState(null);
  const [grantOwnerEmail, setGrantOwnerEmail] = reactExports.useState("");
  const [grantingOwner, setGrantingOwner] = reactExports.useState(false);
  const [revokingOwnerEmail, setRevokingOwnerEmail] = reactExports.useState(null);
  const [homeForm, setHomeForm] = reactExports.useState(() => getHomeHeroContent({
    ...HOME_HERO_DEFAULTS
  }));
  const [pageForms, setPageForms] = reactExports.useState(() => buildPageHeroForms());
  const [navForm, setNavForm] = reactExports.useState(() => getNavigationLabels({
    ...NAV_LABEL_DEFAULTS
  }));
  const [contactForm, setContactForm] = reactExports.useState(() => getContactDetails({
    ...CONTACT_DETAILS_DEFAULTS
  }));
  const [savingHome, setSavingHome] = reactExports.useState(false);
  const [savingPage, setSavingPage] = reactExports.useState(null);
  const [savingNavigation, setSavingNavigation] = reactExports.useState(false);
  const [savingContact, setSavingContact] = reactExports.useState(false);
  const loadDashboard = reactExports.useCallback(() => {
    const snapshot = collectStats(role, adminEmails.length, managedAdminEmails.length);
    setUsers(snapshot.users);
    setLogs(snapshot.logs);
    setStats(snapshot.stats);
    setLastRefreshedAt((/* @__PURE__ */ new Date()).toISOString());
  }, [role, adminEmails.length, managedAdminEmails.length]);
  const loadContentForms = reactExports.useCallback(() => {
    setHomeForm(getHomeHeroContent({
      ...HOME_HERO_DEFAULTS
    }));
    setPageForms(buildPageHeroForms());
    setNavForm(getNavigationLabels({
      ...NAV_LABEL_DEFAULTS
    }));
    setContactForm(getContactDetails({
      ...CONTACT_DETAILS_DEFAULTS
    }));
  }, []);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (!isAdmin) {
      navigate({
        to: "/profile"
      });
      toast.error("You do not have admin access.");
    }
  }, [loading, user, isAdmin, navigate]);
  reactExports.useEffect(() => {
    if (!isAdmin) return;
    loadDashboard();
    const intervalId = window.setInterval(loadDashboard, LIVE_REFRESH_MS);
    const onChanged = () => loadDashboard();
    const onStorage = (event) => {
      if (event.key === null) {
        loadDashboard();
        loadContentForms();
        return;
      }
      const dashboardKey = event.key === AUTH_ACCOUNTS_KEY || event.key === AUTH_ADMIN_EMAILS_KEY || event.key === INTERNSHIPS_KEY || event.key === MAGAZINES_KEY || event.key === MEMBERS_KEY || event.key === CHANGE_LOG_KEY || event.key.startsWith(APPLIED_KEY_PREFIX);
      if (dashboardKey) {
        loadDashboard();
      }
      if (event.key === SITE_CONTENT_KEY) {
        loadContentForms();
      }
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onChanged);
    window.addEventListener(APPLIED_CHANGED_EVENT, onChanged);
    window.addEventListener(INTERNSHIPS_CHANGED_EVENT, onChanged);
    window.addEventListener(MAGAZINES_CHANGED_EVENT, onChanged);
    window.addEventListener(MEMBERS_CHANGED_EVENT, onChanged);
    window.addEventListener(CHANGE_LOG_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(AUTH_CHANGED_EVENT, onChanged);
      window.removeEventListener(APPLIED_CHANGED_EVENT, onChanged);
      window.removeEventListener(INTERNSHIPS_CHANGED_EVENT, onChanged);
      window.removeEventListener(MAGAZINES_CHANGED_EVENT, onChanged);
      window.removeEventListener(MEMBERS_CHANGED_EVENT, onChanged);
      window.removeEventListener(CHANGE_LOG_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, [isAdmin, loadDashboard, loadContentForms]);
  reactExports.useEffect(() => {
    if (!isAdmin) return;
    loadContentForms();
    const onContentChanged = () => loadContentForms();
    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, onContentChanged);
    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, onContentChanged);
    };
  }, [isAdmin, loadContentForms]);
  const managedSlotsRemaining = Math.max(0, MAX_ADMINS - managedAdminEmails.length);
  const visibleUsers = reactExports.useMemo(() => {
    if (isOwner) {
      return users;
    }
    return users.filter((account) => getUserRole(account.email) === "user");
  }, [isOwner, users]);
  const statsCards = reactExports.useMemo(() => [{
    label: "Registered users",
    value: stats.usersTotal,
    helper: "Local storage accounts",
    icon: Users
  }, {
    label: "Active admins",
    value: stats.adminsTotal,
    helper: `${stats.managedAdmins}/${MAX_ADMINS} managed + reserved`,
    icon: ShieldCheck
  }, {
    label: "Members",
    value: stats.membersTotal,
    helper: "Founding + core",
    icon: BookUser
  }, {
    label: "Internship posts",
    value: stats.internshipsTotal,
    helper: "Published opportunities",
    icon: BriefcaseBusiness
  }, {
    label: "Magazine posts",
    value: stats.magazinesTotal,
    helper: "Published opportunities",
    icon: Newspaper
  }, {
    label: "Application users",
    value: stats.usersAppliedInternships + stats.usersAppliedMagazines,
    helper: "Users who applied at least once",
    icon: BadgeCheck
  }], [stats]);
  const submitGrantAdmin = async (event) => {
    event.preventDefault();
    if (!isOwner) return;
    const email = grantAdminEmail.trim().toLowerCase();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setGrantingAdmin(true);
      await grantAdminAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "admin.grant",
        target: email,
        detail: "Admin access granted by super admin"
      });
      setGrantAdminEmail("");
      loadDashboard();
      toast.success("Admin access granted.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not grant admin access.", {
        description: message
      });
    } finally {
      setGrantingAdmin(false);
    }
  };
  const handleRevokeAdmin = async (email) => {
    if (!isOwner) return;
    try {
      setRevokingAdminEmail(email);
      await revokeAdminAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "admin.revoke",
        target: email,
        detail: "Admin access revoked by super admin"
      });
      loadDashboard();
      toast.success("Admin access revoked.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not revoke admin access.", {
        description: message
      });
    } finally {
      setRevokingAdminEmail(null);
    }
  };
  const submitGrantOwner = async (event) => {
    event.preventDefault();
    if (!isOwner) return;
    const email = grantOwnerEmail.trim().toLowerCase();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setGrantingOwner(true);
      await grantOwnerAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "owner.grant",
        target: email,
        detail: "Owner access granted"
      });
      setGrantOwnerEmail("");
      loadDashboard();
      toast.success("Owner access granted.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not grant owner access.", {
        description: message
      });
    } finally {
      setGrantingOwner(false);
    }
  };
  const handleRevokeOwner = async (email) => {
    if (!isOwner) return;
    try {
      setRevokingOwnerEmail(email);
      await revokeOwnerAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "owner.revoke",
        target: email,
        detail: "Owner access revoked"
      });
      loadDashboard();
      toast.success("Owner access revoked.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not revoke owner access.", {
        description: message
      });
    } finally {
      setRevokingOwnerEmail(null);
    }
  };
  const updatePageField = (key, field, value) => {
    setPageForms((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };
  const savePageHero = (key) => {
    try {
      setSavingPage(key);
      setPageHeroContent(key, pageForms[key]);
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.update",
        target: PAGE_HERO_LABELS[key],
        detail: "Updated page hero content"
      });
      loadDashboard();
      toast.success(`${PAGE_HERO_LABELS[key]} page content updated.`, {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update page content.", {
        description: message
      });
    } finally {
      setSavingPage(null);
    }
  };
  const resetPageHero = (key) => {
    try {
      resetPageHeroContent(key);
      setPageForms((prev) => ({
        ...prev,
        [key]: getPageHeroContent(key, PAGE_HERO_DEFAULTS[key])
      }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: PAGE_HERO_LABELS[key],
        detail: "Reset page hero content"
      });
      loadDashboard();
      toast.success(`${PAGE_HERO_LABELS[key]} page content reset.`, {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset page content.", {
        description: message
      });
    }
  };
  const saveHomeHero = async (event) => {
    event.preventDefault();
    try {
      setSavingHome(true);
      setHomeHeroContent(homeForm);
      logChange({
        actorEmail,
        actorRole,
        action: "site.home.update",
        target: "Home hero",
        detail: "Updated home hero content"
      });
      loadDashboard();
      toast.success("Home hero updated.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update home hero.", {
        description: message
      });
    } finally {
      setSavingHome(false);
    }
  };
  const handleResetHomeHero = () => {
    try {
      resetHomeHeroContent();
      setHomeForm(getHomeHeroContent({
        ...HOME_HERO_DEFAULTS
      }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.home.reset",
        target: "Home hero",
        detail: "Reset home hero content"
      });
      loadDashboard();
      toast.success("Home hero reset.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset home hero.", {
        description: message
      });
    }
  };
  const updateNavField = (key, value) => {
    setNavForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const saveNavigation = () => {
    try {
      setSavingNavigation(true);
      setNavigationLabels(navForm);
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.update",
        target: "Navigation labels",
        detail: "Updated page names shown in navbar/footer"
      });
      loadDashboard();
      toast.success("Navigation labels updated.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update navigation labels.", {
        description: message
      });
    } finally {
      setSavingNavigation(false);
    }
  };
  const handleResetNavigation = () => {
    try {
      resetNavigationLabels();
      setNavForm(getNavigationLabels({
        ...NAV_LABEL_DEFAULTS
      }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: "Navigation labels",
        detail: "Reset page names shown in navbar/footer"
      });
      loadDashboard();
      toast.success("Navigation labels reset.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset navigation labels.", {
        description: message
      });
    }
  };
  const updateContactField = (key, value) => {
    setContactForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const saveContact = () => {
    try {
      setSavingContact(true);
      setContactDetails(contactForm);
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.update",
        target: "Contact details",
        detail: "Updated contact page and footer contact details"
      });
      loadDashboard();
      toast.success("Contact details updated.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update contact details.", {
        description: message
      });
    } finally {
      setSavingContact(false);
    }
  };
  const handleResetContact = () => {
    try {
      resetContactDetails();
      setContactForm(getContactDetails({
        ...CONTACT_DETAILS_DEFAULTS
      }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: "Contact details",
        detail: "Reset contact page and footer contact details"
      });
      loadDashboard();
      toast.success("Contact details reset.", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset contact details.", {
        description: message
      });
    }
  };
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground", children: "Loading dashboard..." }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-primary", children: "Access restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Only admins can open this dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground", children: "Go to profile" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gold/30 bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Control Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl text-primary", children: isOwner ? "Owner Dashboard" : "Admin Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-3xl text-sm text-muted-foreground", children: isOwner ? "Manage access levels, content, and live operations from one place." : "Manage website content and live operations from one place." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-4 w-4" }),
          "Last refresh: ",
          new Date(lastRefreshedAt).toLocaleTimeString()
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: statsCards.map(({
        label,
        value,
        helper,
        icon: Icon
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-display text-3xl text-primary", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: helper })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-primary", children: "Internship applications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            stats.totalInternshipApplications,
            " total from ",
            stats.usersAppliedInternships,
            " users"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-primary", children: "Magazine applications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            stats.totalMagazineApplications,
            " total from ",
            stats.usersAppliedMagazines,
            " users"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto grid max-w-7xl gap-6 px-6 pb-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "Access Controls" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground", children: [
            "Managed slots left: ",
            managedSlotsRemaining
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border border-gold/35 bg-gold/10 p-3 text-sm text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Reserved admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            SYSTEM_ADMIN_EMAIL,
            " is always admin and does not use managed slots."
          ] })
        ] }),
        isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitGrantAdmin, className: "mt-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Grant admin access by Gmail ID",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: grantAdminEmail, onChange: (event) => setGrantAdminEmail(event.target.value), required: true, placeholder: "user@gmail.com", className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Only users with existing website accounts can be granted admin access." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: grantingAdmin, className: "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: grantingAdmin ? "Granting..." : "Grant Admin Access" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Admin access is managed by super admin." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Managed admins" }),
          managedAdminEmails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground", children: "No managed admins yet." }) : managedAdminEmails.map((email) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md border border-border bg-background px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: email }),
            isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRevokeAdmin(email), disabled: revokingAdminEmail === email, className: "rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60", children: revokingAdminEmail === email ? "Revoking..." : "Revoke" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Managed by super admin" })
          ] }, email))
        ] }),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-primary", children: "Owner Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "You can add another owner or transfer ownership by adding another owner first, then revoking yourself." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitGrantOwner, className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
              "Grant owner access by Gmail ID",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: grantOwnerEmail, onChange: (event) => setGrantOwnerEmail(event.target.value), required: true, placeholder: "user@gmail.com", className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: grantingOwner, className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
              grantingOwner ? "Granting..." : "Grant Owner Access"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Current owners" }),
            ownerEmails.map((email) => {
              const canRemove = ownerEmails.length > 1;
              const isRevoking = revokingOwnerEmail === email;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md border border-border bg-card px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRevokeOwner(email), disabled: !canRemove || isRevoking, className: "rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50", children: isRevoking ? "Revoking..." : "Revoke" })
              ] }, email);
            })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "Quick Edit Access" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isOwner ? "You and admins can modify website entities directly on these pages." : "Only admins can modify website entities directly on these pages." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-3 sm:grid-cols-2", children: [{
          to: "/members",
          label: "Edit members"
        }, {
          to: "/internships",
          label: "Edit internships"
        }, {
          to: "/magazines",
          label: "Edit magazines"
        }, {
          to: "/profile",
          label: "Profile & sign out"
        }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.to, className: "inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-secondary", children: item.label }, item.to)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-lg border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-primary", children: "Activity visibility" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: isOwner ? "You can review all activity changes." : "You can review admin activity changes only." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "Website Content Editor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Update page names, contact details, and page content. Changes sync instantly across navbar, contact page, and footer." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: saveHomeHero, className: "mt-6 rounded-xl border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-primary", children: "Home Hero" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Motto",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.motto, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              motto: event.target.value
            })), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Title line one",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.titleLineOne, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              titleLineOne: event.target.value
            })), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Title accent",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.titleAccent, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              titleAccent: event.target.value
            })), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground md:col-span-2", children: [
            "Description",
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: homeForm.description, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              description: event.target.value
            })), rows: 3, className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Primary button text",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.primaryCtaText, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              primaryCtaText: event.target.value
            })), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Secondary button text",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.secondaryCtaText, onChange: (event) => setHomeForm((prev) => ({
              ...prev,
              secondaryCtaText: event.target.value
            })), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground md:col-span-2", children: [
            "Hero image URL or data URL",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: homeForm.image, onChange: (event) => setHomeForm((prev) => ({
                ...prev,
                image: event.target.value
              })), className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: savingHome, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: savingHome ? "Saving..." : "Save Home Hero" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResetHomeHero, className: "inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
            " Reset"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-primary", children: "Navigation Labels" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Updating these names changes both navbar and footer explore labels." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-3", children: NAV_LABEL_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            PAGE_HERO_LABELS[key],
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: navForm[key], onChange: (event) => updateNavField(key, event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }, key)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: saveNavigation, disabled: savingNavigation, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: savingNavigation ? "Saving..." : "Save Labels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResetNavigation, className: "inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
              " Reset"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-primary", children: "Contact Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "These values sync to Contact page and footer connect section." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
              "Email",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.email, onChange: (event) => updateContactField("email", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Primary phone label",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.phonePrimaryLabel, onChange: (event) => updateContactField("phonePrimaryLabel", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Primary phone number",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.phonePrimaryNumber, onChange: (event) => updateContactField("phonePrimaryNumber", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Secondary phone label",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.phoneSecondaryLabel, onChange: (event) => updateContactField("phoneSecondaryLabel", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Secondary phone number",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.phoneSecondaryNumber, onChange: (event) => updateContactField("phoneSecondaryNumber", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "LinkedIn URL",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.linkedInUrl, onChange: (event) => updateContactField("linkedInUrl", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "LinkedIn label",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.linkedInLabel, onChange: (event) => updateContactField("linkedInLabel", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Instagram URL",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.instagramUrl, onChange: (event) => updateContactField("instagramUrl", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
                "Instagram label",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contactForm.instagramLabel, onChange: (event) => updateContactField("instagramLabel", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: saveContact, disabled: savingContact, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: savingContact ? "Saving..." : "Save Contact Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResetContact, className: "inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
              " Reset"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 lg:grid-cols-2", children: PAGE_HERO_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl text-primary", children: [
          PAGE_HERO_LABELS[key],
          " Page Hero"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Eyebrow",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: pageForms[key].eyebrow ?? "", onChange: (event) => updatePageField(key, "eyebrow", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Title",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: pageForms[key].title, onChange: (event) => updatePageField(key, "title", event.target.value), className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs uppercase tracking-wide text-muted-foreground", children: [
            "Subtitle",
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: pageForms[key].subtitle ?? "", onChange: (event) => updatePageField(key, "subtitle", event.target.value), rows: 3, className: "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => savePageHero(key), disabled: savingPage === key, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: savingPage === key ? "Saving..." : "Save" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => resetPageHero(key), className: "inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" }),
              " Reset"
            ] })
          ] })
        ] })
      ] }, key)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "User Accounts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isOwner ? "All accounts are shown here for access management." : "Privileged accounts are hidden in this view." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[380px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[720px] border-collapse text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-secondary/70 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-medium text-primary", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-medium text-primary", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-medium text-primary", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-medium text-primary", children: "Created" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: visibleUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-3 py-8 text-center text-sm text-muted-foreground", children: "No visible user accounts." }) }) : visibleUsers.map((account) => {
          const accountRole = isOwner ? getUserRole(account.email) : "user";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-foreground", children: [
              account.firstName,
              " ",
              account.lastName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: account.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: accountRole }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-muted-foreground", children: new Date(account.createdAt).toLocaleString() })
          ] }, account.id);
        }) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "Recent Changes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isOwner ? "You can review all recorded changes." : "You can review admin-recorded changes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground", children: "No visible changes yet." }) : logs.slice(0, 40).map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-lg border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-primary", children: formatAction(entry.action) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(entry.createdAt).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-foreground", children: [
          "Target: ",
          entry.target
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "By ",
          entry.actorEmail,
          " (",
          entry.actorRole,
          ")"
        ] }),
        entry.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: entry.detail })
      ] }, entry.id)) })
    ] }) })
  ] });
}
function RoleBadge({
  role
}) {
  if (role === "owner") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-gold/20 px-2 py-1 text-xs uppercase tracking-wide text-primary", children: "owner" });
  }
  if (role === "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide text-primary", children: "admin" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-1 text-xs uppercase tracking-wide text-secondary-foreground", children: "user" });
}
export {
  AdminPage as component
};

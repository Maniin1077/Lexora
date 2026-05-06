import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  AUTH_ACCOUNTS_KEY,
  AUTH_ADMIN_EMAILS_KEY,
  AUTH_CHANGED_EVENT,
  MAX_ADMINS,
  SYSTEM_ADMIN_EMAIL,
  getAllUsersForAdmin,
  getUserRole,
  useAuth,
  type AdminAccountRecord,
  type UserRole,
} from "@/hooks/useAuth";
import {
  APPLIED_CHANGED_EVENT,
  APPLIED_KEY_PREFIX,
  getApplicationSummary,
} from "@/lib/applications";
import {
  CHANGE_LOG_CHANGED_EVENT,
  CHANGE_LOG_KEY,
  getVisibleChangeLogsForRole,
  logChange,
  type ChangeAction,
  type ChangeLogEntry,
} from "@/lib/change-log";
import {
  CONTACT_DETAILS_DEFAULTS,
  HOME_HERO_DEFAULTS,
  NAV_LABEL_DEFAULTS,
  NAV_LABEL_KEYS,
  PAGE_HERO_DEFAULTS,
  PAGE_HERO_KEYS,
  PAGE_HERO_LABELS,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
  getContactDetails,
  getHomeHeroContent,
  getNavigationLabels,
  getPageHeroContent,
  resetContactDetails,
  resetHomeHeroContent,
  resetNavigationLabels,
  resetPageHeroContent,
  setContactDetails,
  setHomeHeroContent,
  setNavigationLabels,
  setPageHeroContent,
  type ContactDetailsContent,
  type NavLabelKey,
  type PageHeroContent,
  type PageHeroKey,
} from "@/lib/site-content";
import {
  INTERNSHIPS_CHANGED_EVENT,
  INTERNSHIPS_KEY,
  getInternships,
} from "@/lib/internships";
import {
  MAGAZINES_CHANGED_EVENT,
  MAGAZINES_KEY,
  getMagazines,
} from "@/lib/magazines";
import { MEMBERS_CHANGED_EVENT, MEMBERS_KEY, getMembers } from "@/lib/members";
import {
  BadgeCheck,
  BookUser,
  BriefcaseBusiness,
  Clock3,
  Image as ImageIcon,
  Newspaper,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const LIVE_REFRESH_MS = 1500;

type HeroField = keyof Pick<PageHeroContent, "eyebrow" | "title" | "subtitle">;

interface DashboardStats {
  usersTotal: number;
  adminsTotal: number;
  managedAdmins: number;
  membersTotal: number;
  internshipsTotal: number;
  magazinesTotal: number;
  usersAppliedInternships: number;
  usersAppliedMagazines: number;
  totalInternshipApplications: number;
  totalMagazineApplications: number;
  visibleChanges: number;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - Lexora Community" },
      {
        name: "description",
        content:
          "Admin controls for users, permissions, website content, and activity insights.",
      },
    ],
  }),
  component: AdminPage,
});

function buildPageHeroForms(): Record<PageHeroKey, PageHeroContent> {
  const forms = {} as Record<PageHeroKey, PageHeroContent>;

  for (const key of PAGE_HERO_KEYS) {
    forms[key] = getPageHeroContent(key, PAGE_HERO_DEFAULTS[key]);
  }

  return forms;
}

function formatAction(action: ChangeAction): string {
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

function collectStats(role: UserRole, adminCount: number, managedAdminCount: number): {
  stats: DashboardStats;
  users: AdminAccountRecord[];
  logs: ChangeLogEntry[];
} {
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
      visibleChanges: logs.length,
    },
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
    revokeOwnerAccess,
  } = useAuth();

  const navigate = useNavigate();
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";

  const [users, setUsers] = useState<AdminAccountRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
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
    visibleChanges: 0,
  });
  const [logs, setLogs] = useState<ChangeLogEntry[]>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() =>
    new Date().toISOString(),
  );

  const [grantAdminEmail, setGrantAdminEmail] = useState("");
  const [grantingAdmin, setGrantingAdmin] = useState(false);
  const [revokingAdminEmail, setRevokingAdminEmail] = useState<string | null>(null);

  const [grantOwnerEmail, setGrantOwnerEmail] = useState("");
  const [grantingOwner, setGrantingOwner] = useState(false);
  const [revokingOwnerEmail, setRevokingOwnerEmail] = useState<string | null>(null);

  const [homeForm, setHomeForm] = useState(() =>
    getHomeHeroContent({ ...HOME_HERO_DEFAULTS }),
  );
  const [pageForms, setPageForms] = useState<Record<PageHeroKey, PageHeroContent>>(
    () => buildPageHeroForms(),
  );
  const [navForm, setNavForm] = useState(() =>
    getNavigationLabels({ ...NAV_LABEL_DEFAULTS }),
  );
  const [contactForm, setContactForm] = useState<ContactDetailsContent>(() =>
    getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }),
  );

  const [savingHome, setSavingHome] = useState(false);
  const [savingPage, setSavingPage] = useState<PageHeroKey | null>(null);
  const [savingNavigation, setSavingNavigation] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const loadDashboard = useCallback(() => {
    const snapshot = collectStats(role, adminEmails.length, managedAdminEmails.length);
    setUsers(snapshot.users);
    setLogs(snapshot.logs);
    setStats(snapshot.stats);
    setLastRefreshedAt(new Date().toISOString());
  }, [role, adminEmails.length, managedAdminEmails.length]);

  const loadContentForms = useCallback(() => {
    setHomeForm(getHomeHeroContent({ ...HOME_HERO_DEFAULTS }));
    setPageForms(buildPageHeroForms());
    setNavForm(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));
    setContactForm(getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }));
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    if (!isAdmin) {
      navigate({ to: "/profile" });
      toast.error("You do not have admin access.");
    }
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    loadDashboard();

    const intervalId = window.setInterval(loadDashboard, LIVE_REFRESH_MS);

    const onChanged = () => loadDashboard();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null) {
        loadDashboard();
        loadContentForms();
        return;
      }

      const dashboardKey =
        event.key === AUTH_ACCOUNTS_KEY ||
        event.key === AUTH_ADMIN_EMAILS_KEY ||
        event.key === INTERNSHIPS_KEY ||
        event.key === MAGAZINES_KEY ||
        event.key === MEMBERS_KEY ||
        event.key === CHANGE_LOG_KEY ||
        event.key.startsWith(APPLIED_KEY_PREFIX);

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

  useEffect(() => {
    if (!isAdmin) return;

    loadContentForms();

    const onContentChanged = () => loadContentForms();
    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, onContentChanged);

    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, onContentChanged);
    };
  }, [isAdmin, loadContentForms]);

  const managedSlotsRemaining = Math.max(0, MAX_ADMINS - managedAdminEmails.length);

  const visibleUsers = useMemo(() => {
    if (isOwner) {
      return users;
    }

    return users.filter((account) => getUserRole(account.email) === "user");
  }, [isOwner, users]);

  const statsCards = useMemo(
    () => [
      {
        label: "Registered users",
        value: stats.usersTotal,
        helper: "Local storage accounts",
        icon: Users,
      },
      {
        label: "Active admins",
        value: stats.adminsTotal,
        helper: `${stats.managedAdmins}/${MAX_ADMINS} managed + reserved`,
        icon: ShieldCheck,
      },
      {
        label: "Members",
        value: stats.membersTotal,
        helper: "Founding + core",
        icon: BookUser,
      },
      {
        label: "Internship posts",
        value: stats.internshipsTotal,
        helper: "Published opportunities",
        icon: BriefcaseBusiness,
      },
      {
        label: "Magazine posts",
        value: stats.magazinesTotal,
        helper: "Published opportunities",
        icon: Newspaper,
      },
      {
        label: "Application users",
        value: stats.usersAppliedInternships + stats.usersAppliedMagazines,
        helper: "Users who applied at least once",
        icon: BadgeCheck,
      },
    ],
    [stats],
  );

  const submitGrantAdmin = async (event: FormEvent<HTMLFormElement>) => {
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
        detail: "Admin access granted by super admin",
      });
      setGrantAdminEmail("");
      loadDashboard();
      toast.success("Admin access granted.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not grant admin access.", { description: message });
    } finally {
      setGrantingAdmin(false);
    }
  };

  const handleRevokeAdmin = async (email: string) => {
    if (!isOwner) return;

    try {
      setRevokingAdminEmail(email);
      await revokeAdminAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "admin.revoke",
        target: email,
        detail: "Admin access revoked by super admin",
      });
      loadDashboard();
      toast.success("Admin access revoked.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not revoke admin access.", { description: message });
    } finally {
      setRevokingAdminEmail(null);
    }
  };

  const submitGrantOwner = async (event: FormEvent<HTMLFormElement>) => {
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
        detail: "Owner access granted",
      });
      setGrantOwnerEmail("");
      loadDashboard();
      toast.success("Owner access granted.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not grant owner access.", { description: message });
    } finally {
      setGrantingOwner(false);
    }
  };

  const handleRevokeOwner = async (email: string) => {
    if (!isOwner) return;

    try {
      setRevokingOwnerEmail(email);
      await revokeOwnerAccess(email);
      logChange({
        actorEmail,
        actorRole: "owner",
        action: "owner.revoke",
        target: email,
        detail: "Owner access revoked",
      });
      loadDashboard();
      toast.success("Owner access revoked.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not revoke owner access.", { description: message });
    } finally {
      setRevokingOwnerEmail(null);
    }
  };

  const updatePageField = (key: PageHeroKey, field: HeroField, value: string) => {
    setPageForms((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const savePageHero = (key: PageHeroKey) => {
    try {
      setSavingPage(key);
      setPageHeroContent(key, pageForms[key]);
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.update",
        target: PAGE_HERO_LABELS[key],
        detail: "Updated page hero content",
      });
      loadDashboard();
      toast.success(`${PAGE_HERO_LABELS[key]} page content updated.`, {
        duration: 1500,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update page content.", { description: message });
    } finally {
      setSavingPage(null);
    }
  };

  const resetPageHero = (key: PageHeroKey) => {
    try {
      resetPageHeroContent(key);
      setPageForms((prev) => ({
        ...prev,
        [key]: getPageHeroContent(key, PAGE_HERO_DEFAULTS[key]),
      }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: PAGE_HERO_LABELS[key],
        detail: "Reset page hero content",
      });
      loadDashboard();
      toast.success(`${PAGE_HERO_LABELS[key]} page content reset.`, {
        duration: 1500,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset page content.", { description: message });
    }
  };

  const saveHomeHero = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingHome(true);
      setHomeHeroContent(homeForm);
      logChange({
        actorEmail,
        actorRole,
        action: "site.home.update",
        target: "Home hero",
        detail: "Updated home hero content",
      });
      loadDashboard();
      toast.success("Home hero updated.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update home hero.", { description: message });
    } finally {
      setSavingHome(false);
    }
  };

  const handleResetHomeHero = () => {
    try {
      resetHomeHeroContent();
      setHomeForm(getHomeHeroContent({ ...HOME_HERO_DEFAULTS }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.home.reset",
        target: "Home hero",
        detail: "Reset home hero content",
      });
      loadDashboard();
      toast.success("Home hero reset.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset home hero.", { description: message });
    }
  };

  const updateNavField = (key: NavLabelKey, value: string) => {
    setNavForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateHomeImageFromFile = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setHomeForm((prev) => ({ ...prev, image: result }));
    };
    reader.onerror = () => toast.error("Could not read image file.");
    reader.readAsDataURL(file);
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
        detail: "Updated page names shown in navbar/footer",
      });
      loadDashboard();
      toast.success("Navigation labels updated.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update navigation labels.", { description: message });
    } finally {
      setSavingNavigation(false);
    }
  };

  const handleResetNavigation = () => {
    try {
      resetNavigationLabels();
      setNavForm(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: "Navigation labels",
        detail: "Reset page names shown in navbar/footer",
      });
      loadDashboard();
      toast.success("Navigation labels reset.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset navigation labels.", { description: message });
    }
  };

  const updateContactField = (
    key: keyof ContactDetailsContent,
    value: string,
  ) => {
    setContactForm((prev) => ({ ...prev, [key]: value }));
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
        detail: "Updated contact page and footer contact details",
      });
      loadDashboard();
      toast.success("Contact details updated.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update contact details.", { description: message });
    } finally {
      setSavingContact(false);
    }
  };

  const handleResetContact = () => {
    try {
      resetContactDetails();
      setContactForm(getContactDetails({ ...CONTACT_DETAILS_DEFAULTS }));
      logChange({
        actorEmail,
        actorRole,
        action: "site.page.reset",
        target: "Contact details",
        detail: "Reset contact page and footer contact details",
      });
      loadDashboard();
      toast.success("Contact details reset.", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not reset contact details.", { description: message });
    }
  };

  if (loading || !user) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground">
          Loading dashboard...
        </section>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-primary">Access restricted</h1>
          <p className="mt-3 text-muted-foreground">
            Only admins can open this dashboard.
          </p>
          <Link
            to="/profile"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to profile
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-gold/30 bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Control Center</p>
              <h1 className="mt-2 font-display text-4xl text-primary">
                {isOwner ? "Owner Dashboard" : "Admin Dashboard"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
                {isOwner
                  ? "Manage access levels, content, and live operations from one place."
                  : "Manage website content and live operations from one place."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Last refresh: {new Date(lastRefreshedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statsCards.map(({ label, value, helper, icon: Icon }) => (
              <article key={label} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-3 font-display text-3xl text-primary">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-primary">Internship applications</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.totalInternshipApplications} total from {stats.usersAppliedInternships} users
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-primary">Magazine applications</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.totalMagazineApplications} total from {stats.usersAppliedMagazines} users
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl text-primary">Access Controls</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              Managed slots left: {managedSlotsRemaining}
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-gold/35 bg-gold/10 p-3 text-sm text-primary">
            <p className="font-medium">Reserved admin</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {SYSTEM_ADMIN_EMAIL} is always admin and does not use managed slots.
            </p>
          </div>

          {isOwner ? (
            <form onSubmit={submitGrantAdmin} className="mt-5 space-y-3">
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Grant admin access by Gmail ID
                <input
                  type="email"
                  value={grantAdminEmail}
                  onChange={(event) => setGrantAdminEmail(event.target.value)}
                  required
                  placeholder="user@gmail.com"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Only users with existing website accounts can be granted admin access.
              </p>
              <button
                type="submit"
                disabled={grantingAdmin}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {grantingAdmin ? "Granting..." : "Grant Admin Access"}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Admin access is managed by super admin.
            </p>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Managed admins</p>
            {managedAdminEmails.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
                No managed admins yet.
              </p>
            ) : (
              managedAdminEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
                >
                  <span className="text-sm text-foreground">{email}</span>
                  {isOwner ? (
                    <button
                      onClick={() => handleRevokeAdmin(email)}
                      disabled={revokingAdminEmail === email}
                      className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    >
                      {revokingAdminEmail === email ? "Revoking..." : "Revoke"}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Managed by super admin</span>
                  )}
                </div>
              ))
            )}
          </div>

          {isOwner && (
            <div className="mt-8 rounded-xl border border-border bg-background p-4">
              <h3 className="font-display text-xl text-primary">Owner Management</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                You can add another owner or transfer ownership by adding another owner first, then revoking yourself.
              </p>

              <form onSubmit={submitGrantOwner} className="mt-4 space-y-3">
                <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                  Grant owner access by Gmail ID
                  <input
                    type="email"
                    value={grantOwnerEmail}
                    onChange={(event) => setGrantOwnerEmail(event.target.value)}
                    required
                    placeholder="user@gmail.com"
                    className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                  />
                </label>
                <button
                  type="submit"
                  disabled={grantingOwner}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  <UserPlus className="h-4 w-4" />
                  {grantingOwner ? "Granting..." : "Grant Owner Access"}
                </button>
              </form>

              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current owners</p>
                {ownerEmails.map((email) => {
                  const canRemove = ownerEmails.length > 1;
                  const isRevoking = revokingOwnerEmail === email;

                  return (
                    <div
                      key={email}
                      className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
                    >
                      <span className="text-sm text-foreground">{email}</span>
                      <button
                        onClick={() => handleRevokeOwner(email)}
                        disabled={!canRemove || isRevoking}
                        className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        {isRevoking ? "Revoking..." : "Revoke"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-primary">Quick Edit Access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isOwner
              ? "You and admins can modify website entities directly on these pages."
              : "Only admins can modify website entities directly on these pages."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { to: "/members", label: "Edit members" },
              { to: "/internships", label: "Edit internships" },
              { to: "/magazines", label: "Edit magazines" },
              { to: "/profile", label: "Profile & sign out" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-medium text-primary">Activity visibility</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isOwner
                ? "You can review all activity changes."
                : "You can review admin activity changes only."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-primary">Website Content Editor</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update page names, contact details, and page content. Changes sync instantly across navbar, contact page, and footer.
          </p>

          <form onSubmit={saveHomeHero} className="mt-6 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-display text-xl text-primary">Home Hero</h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Motto
                <input
                  value={homeForm.motto}
                  onChange={(event) =>
                    setHomeForm((prev) => ({ ...prev, motto: event.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Title line one
                <input
                  value={homeForm.titleLineOne}
                  onChange={(event) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      titleLineOne: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Title accent
                <input
                  value={homeForm.titleAccent}
                  onChange={(event) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      titleAccent: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground md:col-span-2">
                Description
                <textarea
                  value={homeForm.description}
                  onChange={(event) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Primary button text
                <input
                  value={homeForm.primaryCtaText}
                  onChange={(event) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      primaryCtaText: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                Secondary button text
                <input
                  value={homeForm.secondaryCtaText}
                  onChange={(event) =>
                    setHomeForm((prev) => ({
                      ...prev,
                      secondaryCtaText: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground md:col-span-2">
                Hero image
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary mt-2">
                  Choose image file
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      updateHomeImageFromFile(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </label>
              {homeForm.image && (
                <div className="md:col-span-2 rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  <div className="flex justify-center">
                    <div className="h-32 w-32 overflow-hidden rounded-lg ring-1 ring-gold/30">
                      <img
                        src={homeForm.image}
                        alt="Home hero preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={savingHome}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {savingHome ? "Saving..." : "Save Home Hero"}
              </button>
              <button
                type="button"
                onClick={handleResetHomeHero}
                className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </form>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-display text-xl text-primary">Navigation Labels</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Updating these names changes both navbar and footer explore labels.
              </p>

              <div className="mt-3 grid gap-3">
                {NAV_LABEL_KEYS.map((key) => (
                  <label
                    key={key}
                    className="block text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {PAGE_HERO_LABELS[key]}
                    <input
                      value={navForm[key]}
                      onChange={(event) => updateNavField(key, event.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveNavigation}
                  disabled={savingNavigation}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {savingNavigation ? "Saving..." : "Save Labels"}
                </button>
                <button
                  type="button"
                  onClick={handleResetNavigation}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  <RefreshCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-display text-xl text-primary">Contact Details</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                These values sync to Contact page and footer connect section.
              </p>

              <div className="mt-3 grid gap-3">
                <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                  Primary email
                  <input
                    value={contactForm.email}
                    onChange={(event) => updateContactField("email", event.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Secondary email name
                    <input
                      value={contactForm.secondaryEmailLabel}
                      onChange={(event) =>
                        updateContactField("secondaryEmailLabel", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Secondary email
                    <input
                      value={contactForm.secondaryEmail}
                      onChange={(event) => updateContactField("secondaryEmail", event.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Tertiary email name
                    <input
                      value={contactForm.tertiaryEmailLabel}
                      onChange={(event) =>
                        updateContactField("tertiaryEmailLabel", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Tertiary email
                    <input
                      value={contactForm.tertiaryEmail}
                      onChange={(event) => updateContactField("tertiaryEmail", event.target.value)}
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    LinkedIn URL
                    <input
                      value={contactForm.linkedInUrl}
                      onChange={(event) =>
                        updateContactField("linkedInUrl", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    LinkedIn label
                    <input
                      value={contactForm.linkedInLabel}
                      onChange={(event) =>
                        updateContactField("linkedInLabel", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Instagram URL
                    <input
                      value={contactForm.instagramUrl}
                      onChange={(event) =>
                        updateContactField("instagramUrl", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Instagram label
                    <input
                      value={contactForm.instagramLabel}
                      onChange={(event) =>
                        updateContactField("instagramLabel", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveContact}
                  disabled={savingContact}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {savingContact ? "Saving..." : "Save Contact Details"}
                </button>
                <button
                  type="button"
                  onClick={handleResetContact}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
                >
                  <RefreshCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {PAGE_HERO_KEYS.map((key) => (
              <div key={key} className="rounded-xl border border-border bg-background p-4">
                <h3 className="font-display text-xl text-primary">
                  {PAGE_HERO_LABELS[key]} Page Hero
                </h3>

                <div className="mt-3 space-y-3">
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Eyebrow
                    <input
                      value={pageForms[key].eyebrow ?? ""}
                      onChange={(event) =>
                        updatePageField(key, "eyebrow", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Title
                    <input
                      value={pageForms[key].title}
                      onChange={(event) =>
                        updatePageField(key, "title", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Subtitle
                    <textarea
                      value={pageForms[key].subtitle ?? ""}
                      onChange={(event) =>
                        updatePageField(key, "subtitle", event.target.value)
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-gold/70"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => savePageHero(key)}
                      disabled={savingPage === key}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {savingPage === key ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetPageHero(key)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" /> Reset
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-primary">User Accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isOwner
              ? "All accounts are shown here for access management."
              : "Privileged accounts are hidden in this view."}
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="max-h-[380px] overflow-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead className="sticky top-0 bg-secondary/70 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium text-primary">Name</th>
                    <th className="px-3 py-2 font-medium text-primary">Email</th>
                    <th className="px-3 py-2 font-medium text-primary">Role</th>
                    <th className="px-3 py-2 font-medium text-primary">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-sm text-muted-foreground">
                        No visible user accounts.
                      </td>
                    </tr>
                  ) : (
                    visibleUsers.map((account) => {
                      const accountRole: UserRole = isOwner
                        ? getUserRole(account.email)
                        : "user";

                      return (
                        <tr key={account.id} className="border-t border-border bg-background">
                          <td className="px-3 py-2 text-foreground">
                            {account.firstName} {account.lastName}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{account.email}</td>
                          <td className="px-3 py-2">
                            <RoleBadge role={accountRole} />
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {new Date(account.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl text-primary">Recent Changes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isOwner
              ? "You can review all recorded changes."
              : "You can review admin-recorded changes."}
          </p>

          <div className="mt-4 space-y-3">
            {logs.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                No visible changes yet.
              </p>
            ) : (
              logs.slice(0, 40).map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-primary">
                      {formatAction(entry.action)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">Target: {entry.target}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    By {entry.actorEmail} ({entry.actorRole})
                  </p>
                  {entry.detail && (
                    <p className="mt-2 text-xs text-muted-foreground">{entry.detail}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "owner") {
    return (
      <span className="rounded-full bg-gold/20 px-2 py-1 text-xs uppercase tracking-wide text-primary">
        owner
      </span>
    );
  }

  if (role === "admin") {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide text-primary">
        admin
      </span>
    );
  }

  return (
    <span className="rounded-full bg-secondary px-2 py-1 text-xs uppercase tracking-wide text-secondary-foreground">
      user
    </span>
  );
}

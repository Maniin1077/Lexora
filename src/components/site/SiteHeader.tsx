import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bell, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import logo from "@/assets/lexora-logo.jpg";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  getNavigationLabels,
  NAV_LABEL_DEFAULTS,
  SITE_CONTENT_CHANGED_EVENT,
  SITE_CONTENT_KEY,
  type NavLabelKey,
} from "@/lib/site-content";
import {
  NOTIFICATIONS_CHANGED_EVENT,
  getNotificationsForEmail,
  markNotificationsReadForEmail,
  type NotificationRecord,
} from "@/lib/notifications";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", key: "about" },
  { to: "/activities", key: "activities" },
  { to: "/members", key: "members" },
  { to: "/internships", key: "internships" },
  { to: "/magazines", key: "magazines" },
  { to: "/contact", key: "contact" },
] as const;

function resolveNavLabel(
  item: (typeof nav)[number],
  labels: Record<NavLabelKey, string>,
) {
  if ("key" in item) {
    return labels[item.key];
  }
  return item.label;
}

function formatNotificationTime(value: string) {
  return new Date(value).toLocaleString();
}

function NotificationBellButton({
  unreadCount,
  onClick,
}: {
  unreadCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary transition hover:border-gold/60 hover:bg-gold/10"
      aria-label="Open notifications"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-red-500" />
      )}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [navLabels, setNavLabels] = useState(() =>
    getNavigationLabels({ ...NAV_LABEL_DEFAULTS }),
  );
  const { user, signOut, loading, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  useEffect(() => {
    const load = () => setNavLabels(getNavigationLabels({ ...NAV_LABEL_DEFAULTS }));

    load();

    const onStorage = (event: StorageEvent) => {
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

  useEffect(() => {
    const loadNotifications = () => {
      void getNotificationsForEmail(user?.email).then(setNotifications);
    };

    loadNotifications();

    const onStorage = (event: StorageEvent) => {
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

  useEffect(() => {
    if (!notificationsOpen || !user?.email) return;

    void markNotificationsReadForEmail(user.email);
    void getNotificationsForEmail(user.email).then(setNotifications);
  }, [notificationsOpen, user?.email]);

  const unreadCount = useMemo(() => {
    if (!user?.email) return 0;
    const normalized = user.email.trim().toLowerCase();
    return notifications.filter((item) => !item.readBy.includes(normalized)).length;
  }, [notifications, user?.email]);

  const navItems = isAdmin
    ? [...nav, { to: "/admin", label: "Admin" }]
    : [...nav];

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

  return (
    <header className="relative sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/40">
            <img
              src={logo}
              alt="Lexora Community logo"
              className="h-full w-full scale-[1.14] object-cover"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-2xl font-semibold text-primary">
              Lexora
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sa Vidyā Ya Vimuktaye
            </span>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          {!loading && user ? (
            <p className="truncate text-sm font-medium text-primary/90">
              Hey, <span className="font-semibold">{user.firstName}!</span>
            </p>
          ) : null}
        </div>

        <nav className="hidden items-center gap-6 md:ml-auto md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              activeProps={{
                className:
                  "text-primary [&]:text-primary border-b-2 border-gold pb-1",
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {resolveNavLabel(item, navLabels)}
            </Link>
          ))}
          {!loading &&
            (user ? (
              <div className="flex items-center gap-3">
                <NotificationBellButton
                  unreadCount={unreadCount}
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                />
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-medium text-primary hover:bg-gold/10"
                >
                  <UserIcon className="h-3.5 w-3.5" /> Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Sign In
              </Link>
            ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          {!loading && user && (
            <NotificationBellButton
              unreadCount={unreadCount}
              onClick={() => setNotificationsOpen((prev) => !prev)}
            />
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-primary"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {notificationsOpen && user && (
        <div className="absolute right-6 top-[4.8rem] z-50 w-[min(92vw,26rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
          <div className="flex items-start justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Important Messages
              </p>
              <h2 className="mt-1 font-display text-lg text-primary">Notifications</h2>
            </div>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-primary"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No important messages yet.
              </div>
            ) : (
              notifications.map((item) => {
                const unread = !item.readBy.includes(user.email.trim().toLowerCase());
                return (
                  <article
                    key={item.id}
                    className={`rounded-xl border p-4 transition ${
                      unread ? "border-gold/40 bg-gold/5" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-medium text-primary">{item.title}</h3>
                          {unread && <span className="h-2 w-2 rounded-full bg-red-500" />}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {formatNotificationTime(item.createdAt)}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {resolveNavLabel(item, navLabels)}
              </Link>
            ))}
            {user ? (
              <>
                <p className="pt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Hey, {user.firstName}!
                </p>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium text-primary"
                >
                  My Profile
                </Link>
                <button
                  onClick={async () => {
                    await handleSignOut();
                    setOpen(false);
                  }}
                  className="py-3 text-left text-sm text-muted-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-primary"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

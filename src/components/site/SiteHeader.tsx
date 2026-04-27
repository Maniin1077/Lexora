import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [navLabels, setNavLabels] = useState(() =>
    getNavigationLabels({ ...NAV_LABEL_DEFAULTS }),
  );
  const { user, signOut, loading, isAdmin } = useAuth();

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

  const navItems = isAdmin
    ? [...nav, { to: "/admin", label: "Admin" }]
    : [...nav];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout Successfully", { duration: 1500 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not log out", { description: message });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Lexora Community logo"
            className="h-12 w-12 rounded-full ring-1 ring-gold/40"
          />
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

        <nav className="hidden items-center gap-6 md:flex md:ml-auto">
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
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
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

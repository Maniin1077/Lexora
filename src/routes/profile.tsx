import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { FormEvent, useEffect, useState } from "react";
import {
  APPLIED_CHANGED_EVENT,
  getApplied,
  removeApplied,
  AppliedItem,
} from "@/lib/applications";
import {
  ExternalLink,
  Mail,
  ShieldCheck,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Lexora Community" },
      {
        name: "description",
        content: "Your Lexora profile and history of applied internships.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const {
    user,
    loading,
    role,
    isAdmin,
    isProfileComplete,
    updateProfile,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = useState<AppliedItem[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    course: "",
    institute: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = () => setApplied(getApplied(user?.email));
    load();
    window.addEventListener(APPLIED_CHANGED_EVENT, load);
    return () => window.removeEventListener(APPLIED_CHANGED_EVENT, load);
  }, [user?.email]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      course: user.course,
      institute: user.institute,
    });
  }, [user?.firstName, user?.lastName, user?.course, user?.institute]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-6 py-32 text-center text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  const name = `${user.firstName} ${user.lastName}`.trim() || user.email || "Member";
  const initials = (user.firstName || user.email || "M").charAt(0).toUpperCase();

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileForm);
      toast.success("Profile saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save profile.", { description: message });
    } finally {
      setSavingProfile(false);
    }
  };

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
    <SiteLayout>
      <PageHero
        contentKey="profile"
        eyebrow="Member Area"
        title="My Profile"
        subtitle="Your Lexora identity and application history."
      />
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div
            className="rounded-2xl border border-gold/30 bg-card p-6 md:col-span-1"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-2xl text-gold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-lg text-primary">
                  {name}
                </p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-left">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    First Name
                  </span>
                  <input
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block text-left">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Last Name
                  </span>
                  <input
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-left">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Course
                </span>
                <input
                  value={profileForm.course}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </label>

              <label className="block text-left">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  College / University / Institute
                </span>
                <input
                  value={profileForm.institute}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, institute: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </label>

              <label className="block text-left">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Email ID
                </span>
                <input
                  value={user.email}
                  readOnly
                  className="mt-1 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                />
              </label>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {savingProfile ? "Saving…" : "Save Profile"}
              </button>
            </form>

            {isAdmin && (
              <div className="mt-5 flex items-center gap-2 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-primary">
                <ShieldCheck className="h-4 w-4 text-accent" />
                {role === "owner" ? "Owner" : "Administrator"}
              </div>
            )}
            <div className="mt-6 space-y-2 text-sm">
              {!isProfileComplete && (
                <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  Complete and save your profile before applying for opportunities.
                </p>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block rounded-md bg-primary px-4 py-2 text-center font-medium text-primary-foreground hover:opacity-90"
                >
                  Open Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="block w-full rounded-md border border-border px-4 py-2 text-center font-medium text-foreground hover:bg-secondary"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                Applied Opportunities
              </h2>
              <span className="text-xs text-muted-foreground">
                {applied.length} total
              </span>
            </div>
            {applied.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  You have not marked any opportunities as applied yet.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    to="/internships"
                    className="inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Browse Internships
                  </Link>
                  <Link
                    to="/magazines"
                    className="inline-block rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Browse Magazines
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {applied.map((item) => (
                  <AppliedOpportunityRow
                    key={item.id}
                    item={item}
                    userEmail={user.email}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AppliedOpportunityRow({
  item,
  userEmail,
}: {
  item: AppliedItem;
  userEmail: string;
}) {
  const closed = item.deadline
    ? new Date(item.deadline).getTime() < Date.now()
    : false;

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium text-primary">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.organization}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" /> Applied on{" "}
            {new Date(item.appliedAt).toLocaleDateString()}
          </p>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-secondary-foreground">
            {item.kind === "magazine" ? "Magazine" : "Internship"}
          </span>
          {closed && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              Closed
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {closed ? (
          <button
            disabled
            className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground"
          >
            Closed
          </button>
        ) : (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-secondary"
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <button
          onClick={() => removeApplied(userEmail, item.id)}
          className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
          aria-label="Remove from history"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </li>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  APPLIED_CHANGED_EVENT,
  isApplied,
  markApplied,
} from "@/lib/applications";
import {
  addMagazine,
  getMagazines,
  MAGAZINES_CHANGED_EVENT,
  MAGAZINES_KEY,
  MagazineItem,
  removeMagazine,
  updateMagazine,
  subscribeMagazines,
} from "@/lib/magazines";
import { logChange } from "@/lib/change-log";

export const Route = createFileRoute("/magazines")({
  head: () => ({
    meta: [
      { title: "Internship Magazines — Lexora Community" },
      {
        name: "description",
        content:
          "Curated internship opportunities posted by Lexora. Sign in to apply and track your applications.",
      },
    ],
  }),
  component: MagazinesPage,
});

function MagazinesPage() {
  const { user, isAdmin, isProfileComplete, role } = useAuth();
  const [items, setItems] = useState<MagazineItem[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<MagazineItem | null>(
    null,
  );
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";

  const load = async () => {
    setItems(await getMagazines());
  };

  useEffect(() => {
    void load();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === MAGAZINES_KEY) {
        void load();
      }
    };

    window.addEventListener(MAGAZINES_CHANGED_EVENT, () => void load());
    window.addEventListener("storage", onStorage);

    const unsub = subscribeMagazines(() => {
      void load();
    });

    return () => {
      try {
        unsub?.();
      } catch (e) {
        // ignore
      }
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const sorted = useMemo(() => {
    if (!items) return [];
    const now = Date.now();
    return [...items].sort((a, b) => {
      const aExp = new Date(a.deadline).getTime() < now;
      const bExp = new Date(b.deadline).getTime() < now;
      if (aExp !== bExp) return aExp ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [items]);

  return (
    <SiteLayout>
      <PageHero
        contentKey="magazines"
        eyebrow="Opportunities"
        title="Internship Magazines"
        subtitle="Curated internship opportunities. Sign in to apply and track your applications."
      />
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {isAdmin && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4">
            <div>
              <p className="font-display text-lg text-primary">Admin tools</p>
              <p className="text-xs text-muted-foreground">
                Add, manage and remove internship listings.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New Magazine
            </button>
          </div>
        )}

        {items === null ? (
          <div className="py-20 text-center text-muted-foreground">
            Loading…
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-xl text-primary">
              No magazines yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAdmin
                ? 'Click "New Magazine" to publish your first internship listing.'
                : "Check back soon — new opportunities are added regularly."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {sorted.map((m) => (
              <MagazineCard
                key={m.id}
                m={m}
                isAdmin={isAdmin}
                isLoggedIn={Boolean(user)}
                isProfileComplete={isProfileComplete}
                userEmail={user?.email ?? null}
                onEdit={() => setEditingMagazine(m)}
                onDelete={async () => {
                  if (!confirm(`Delete "${m.title}"?`)) return;
                  await removeMagazine(m.id);
                  logChange({
                    actorEmail,
                    actorRole,
                    action: "magazine.remove",
                    target: m.title,
                    detail: `Removed magazine for ${m.organization}`,
                  });
                  toast.success("Deleted");
                  void load();
                }}
              />
            ))}
          </div>
        )}
      </section>

      {showForm && isAdmin && user && (
        <NewMagazineDialog
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            void load();
          }}
          userEmail={user.email ?? null}
          actorRole={actorRole}
        />
      )}

      {editingMagazine && isAdmin && user && (
        <NewMagazineDialog
          magazine={editingMagazine}
          onClose={() => setEditingMagazine(null)}
          onSaved={() => {
            setEditingMagazine(null);
            void load();
          }}
          userEmail={user.email ?? null}
          actorRole={actorRole}
        />
      )}
    </SiteLayout>
  );
}

function MagazineCard({
  m,
  isAdmin,
  isLoggedIn,
  isProfileComplete,
  userEmail,
  onEdit,
  onDelete,
}: {
  m: MagazineItem;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  userEmail: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const expired = new Date(m.deadline).getTime() < Date.now();
  const [appliedNow, setAppliedNow] = useState(false);

  useEffect(() => {
    void isApplied(userEmail, m.id).then(setAppliedNow);
    const h = () => {
      void isApplied(userEmail, m.id).then(setAppliedNow);
    };
    window.addEventListener(APPLIED_CHANGED_EVENT, h);
    return () => window.removeEventListener(APPLIED_CHANGED_EVENT, h);
  }, [userEmail, m.id]);

  const ensureCanApply = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in first", {
        description: "You must be logged in to register for internships.",
        action: {
          label: "Sign in",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return false;
    }

    if (!isProfileComplete) {
      toast.error("Complete your profile first", {
        description:
          "Update first name, last name, course, and institute before applying.",
        action: {
          label: "Open profile",
          onClick: () => (window.location.href = "/profile"),
        },
      });
      return false;
    }

    if (expired) {
      toast.error("This magazine is closed");
      return false;
    }
    return true;
  };

  const handleOpenRegistration = () => {
    if (!ensureCanApply()) return;
    toast.loading("Opening registration form…", { id: m.id, duration: 1500 });
    window.open(m.registration_link, "_blank", "noopener,noreferrer");
  };

  const handleMarkApplied = async () => {
    if (!ensureCanApply() || !userEmail) return;

    await markApplied(userEmail, {
      id: m.id,
      title: m.title,
      organization: m.organization,
      appliedAt: new Date().toISOString(),
      link: m.registration_link,
      kind: "magazine",
      deadline: m.deadline,
    });
    setTimeout(() => {
      toast.success("Marked as Applied", {
        id: m.id,
        description: "Added to your profile history.",
      });
    }, 600);
  };

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-gold/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {m.organization}
          </p>
          <h3 className="mt-1 font-display text-xl text-primary">{m.title}</h3>
        </div>
        {expired ? (
          <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Closed
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Open
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-foreground/80">
        {m.description}
      </p>
      {m.tags && m.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" /> Deadline:{" "}
        <span className={expired ? "text-destructive" : "text-foreground"}>
          {new Date(m.deadline).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {expired ? (
          <button
            disabled
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground"
          >
            <Clock className="h-4 w-4" /> Closed
          </button>
        ) : appliedNow ? (
          <button
            disabled
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            <CheckCircle2 className="h-4 w-4" /> Applied
          </button>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            <button
              onClick={handleOpenRegistration}
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-navy-deep transition hover:translate-y-[-1px]"
              style={{
                background: "var(--gradient-gold)",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleMarkApplied}
              className="rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary"
            >
              Mark Applied
            </button>
          </div>
        )}
        {isAdmin && (
          <button
            onClick={onEdit}
            className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-primary"
            aria-label="Edit magazine"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {isAdmin && (
          <button
            onClick={onDelete}
            className="rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10"
            aria-label="Delete magazine"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  );
}

function NewMagazineDialog({
  magazine,
  onClose,
  onSaved,
  userEmail,
  actorRole,
}: {
  magazine?: MagazineItem;
  onClose: () => void;
  onSaved: () => void;
  userEmail: string | null;
  actorRole: "owner" | "admin";
}) {
  const isEditing = Boolean(magazine);
  const [form, setForm] = useState({
    title: magazine?.title ?? "",
    organization: magazine?.organization ?? "",
    description: magazine?.description ?? "",
    registration_link: magazine?.registration_link ?? "",
    deadline: magazine ? toDatetimeLocalValue(magazine.deadline) : "",
    tags: magazine?.tags?.join(", ") ?? "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.organization ||
      !form.registration_link ||
      !form.deadline
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        description: form.description.trim(),
        registration_link: form.registration_link.trim(),
        deadline: new Date(form.deadline).toISOString(),
        tags: tags.length ? tags : null,
        posted_by_email: userEmail,
      };

      if (isEditing && magazine) {
        await updateMagazine(magazine.id, payload);
        await logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "magazine.update",
          target: payload.title,
          detail: `Updated magazine for ${payload.organization}`,
        });
      } else {
        await addMagazine(payload);
        await logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "magazine.add",
          target: payload.title,
          detail: `Added magazine for ${payload.organization}`,
        });
      }

      toast.success(isEditing ? "Opportunity updated" : "Opportunity published");
      onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save opportunity", { description: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-display text-2xl text-primary">
          {isEditing ? "Edit Internship Opportunity" : "New Internship Opportunity"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {isEditing
            ? "Update details like deadline, description, or registration link."
            : "Publish a new opportunity for the community."}
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3 text-sm">
          <Field
            label="Title *"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
            placeholder="Research Intern — Constitutional Law"
          />
          <Field
            label="Organization *"
            value={form.organization}
            onChange={(v) => setForm({ ...form, organization: v })}
            placeholder="Lexora Community"
          />
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
              placeholder="Brief overview of the role and responsibilities."
            />
          </div>
          <Field
            label="Registration Link *"
            value={form.registration_link}
            onChange={(v) => setForm({ ...form, registration_link: v })}
            placeholder="https://forms.gle/…"
          />
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Deadline *
            </label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <Field
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(v) => setForm({ ...form, tags: v })}
            placeholder="Remote, Law, 1 month"
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toDatetimeLocalValue(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "";
  const offsetMs = dt.getTimezoneOffset() * 60 * 1000;
  return new Date(dt.getTime() - offsetMs).toISOString().slice(0, 16);
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

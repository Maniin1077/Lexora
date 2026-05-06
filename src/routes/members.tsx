import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import {
  addMember,
  getMembers,
  MemberInput,
  MemberItem,
  MEMBERS_CHANGED_EVENT,
  MEMBERS_KEY,
  removeMember,
  updateMember,
} from "@/lib/members";
import { logChange } from "@/lib/change-log";
import { toast } from "sonner";
import { Download, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members — Lexora Community" },
      {
        name: "description",
        content: "Meet the founding and core members behind Lexora Community.",
      },
      { property: "og:title", content: "Lexora Members" },
      {
        property: "og:description",
        content: "The founding and core team driving Lexora's mission forward.",
      },
    ],
  }),
  component: MembersPage,
});

function MemberCard({
  member,
  isAdmin,
  onEdit,
  onDelete,
  gold,
}: {
  member: MemberItem;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  gold?: boolean;
}) {
  return (
    <div className="group text-center">
      <div
        className="relative mx-auto h-56 w-56 overflow-hidden rounded-full transition group-hover:scale-[1.02]"
        style={gold ? { boxShadow: "var(--shadow-gold)" } : {}}
      >
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: `inset 0 0 0 4px ${gold ? "oklch(0.72 0.13 75)" : "oklch(0.22 0.06 260 / 0.3)"}`,
          }}
        />
      </div>
      <h3 className="mt-5 font-display text-xl text-primary">{member.name}</h3>
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        {gold ? "Founding Member" : "Core Member"}
      </p>
      {isAdmin && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-secondary"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

function MembersPage() {
  const { isAdmin, user, role } = useAuth();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";

  const load = () => {
    setMembers(getMembers());
  };

  useEffect(() => {
    load();

    const onChanged = () => load();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === MEMBERS_KEY) {
        load();
      }
    };

    window.addEventListener(MEMBERS_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(MEMBERS_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const founders = useMemo(
    () => members.filter((member) => member.role === "founder"),
    [members],
  );
  const core = useMemo(
    () => members.filter((member) => member.role === "core"),
    [members],
  );

  return (
    <SiteLayout>
      <PageHero
        contentKey="members"
        eyebrow="The Team"
        title="Founding & Core Members"
        subtitle="The people building Lexora — bringing vision, voice and rigour to a growing community."
      />
      {isAdmin && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4">
            <div>
              <p className="font-display text-lg text-primary">Admin tools</p>
              <p className="text-xs text-muted-foreground">
                Add, edit, and remove members. Name and image updates appear instantly.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add Member
            </button>
          </div>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Founding Members
          </p>
          <h2 className="mt-3 font-display text-4xl text-primary">
            Where Lexora Began
          </h2>
        </div>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {founders.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isAdmin={isAdmin}
              gold
              onEdit={() => setEditingMember(m)}
              onDelete={() => {
                if (!confirm(`Remove ${m.name}?`)) return;
                removeMember(m.id);
                logChange({
                  actorEmail,
                  actorRole,
                  action: "member.remove",
                  target: m.name,
                  detail: `Removed ${m.role} member`,
                });
                toast.success("Member removed");
              }}
            />
          ))}
        </div>
      </section>
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Core Members
            </p>
            <h2 className="mt-3 font-display text-4xl text-primary">
              Driving Lexora Forward
            </h2>
          </div>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {core.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                isAdmin={isAdmin}
                onEdit={() => setEditingMember(m)}
                onDelete={() => {
                  if (!confirm(`Remove ${m.name}?`)) return;
                  removeMember(m.id);
                  logChange({
                    actorEmail,
                    actorRole,
                    action: "member.remove",
                    target: m.name,
                    detail: `Removed ${m.role} member`,
                  });
                  toast.success("Member removed");
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {(showForm || editingMember) && isAdmin && (
        <MemberDialog
          member={editingMember ?? undefined}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          actorEmail={actorEmail}
          actorRole={actorRole}
          onSaved={() => {
            setShowForm(false);
            setEditingMember(null);
            load();
          }}
        />
      )}
    </SiteLayout>
  );
}

function MemberDialog({
  member,
  onClose,
  actorEmail,
  actorRole,
  onSaved,
}: {
  member?: MemberItem;
  onClose: () => void;
  actorEmail: string;
  actorRole: "owner" | "admin";
  onSaved: () => void;
}) {
  const isEditing = Boolean(member);
  const [form, setForm] = useState<MemberInput>({
    name: member?.name ?? "",
    image: member?.image ?? "",
    role: member?.role ?? "core",
  });
  const [saving, setSaving] = useState(false);

  const onPickImage = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.onerror = () => toast.error("Could not read image file.");
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const image = form.image.trim();
    if (!name || !image) {
      toast.error("Name and image are required.");
      return;
    }

    try {
      setSaving(true);

      if (isEditing && member) {
        updateMember(member.id, {
          ...form,
          name,
          image,
        });
        logChange({
          actorEmail,
          actorRole,
          action: "member.update",
          target: name,
          detail: `Updated member to ${form.role}`,
        });
        toast.success("Member updated");
      } else {
        addMember({
          ...form,
          name,
          image,
        });
        logChange({
          actorEmail,
          actorRole,
          action: "member.add",
          target: name,
          detail: `Added ${form.role} member`,
        });
        toast.success("Member added");
      }

      onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save member", { description: message });
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
          {isEditing ? "Edit Member" : "Add Member"}
        </h2>

        <form onSubmit={submit} className="mt-5 space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
              placeholder="Member name"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Role *
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value === "founder" ? "founder" : "core",
                })
              }
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
            >
              <option value="founder">Founding Member</option>
              <option value="core">Core Member</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Image *
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">
              <Upload className="h-3.5 w-3.5" /> Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {form.image && (
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] text-muted-foreground mb-2">Preview</p>
              <div className="flex justify-center">
                <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-gold/30">
                  <img
                    src={form.image}
                    alt="Member preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-4">
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
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

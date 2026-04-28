import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout } from "./SiteLayout-CZzDtHch.mjs";
import { P as PageHero } from "./PageHero-Dj5pSq6L.mjs";
import { u as useAuth } from "./router-1DFd5Wq9.mjs";
import { M as MEMBERS_CHANGED_EVENT, r as removeMember, g as getMembers, a as MEMBERS_KEY, u as updateMember, b as addMember } from "./members-DjOLtWjK.mjs";
import { l as logChange } from "./change-log-C_6h4jB_.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, a as Pencil, T as Trash2, X, U as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function MemberCard({
  member,
  isAdmin,
  onEdit,
  onDelete,
  gold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto h-56 w-56 overflow-hidden rounded-full transition group-hover:scale-[1.02]", style: gold ? {
      boxShadow: "var(--shadow-gold)"
    } : {}, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: member.image, alt: member.name, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 rounded-full", style: {
        boxShadow: `inset 0 0 0 4px ${gold ? "oklch(0.72 0.13 75)" : "oklch(0.22 0.06 260 / 0.3)"}`
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-xl text-primary", children: member.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: gold ? "Founding Member" : "Core Member" }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onEdit, className: "inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs text-foreground hover:bg-secondary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
        " Edit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onDelete, className: "inline-flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
        " Remove"
      ] })
    ] })
  ] });
}
function MembersPage() {
  const {
    isAdmin,
    user,
    role
  } = useAuth();
  const [members, setMembers] = reactExports.useState([]);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingMember, setEditingMember] = reactExports.useState(null);
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";
  const load = () => {
    setMembers(getMembers());
  };
  reactExports.useEffect(() => {
    load();
    const onChanged = () => load();
    const onStorage = (event) => {
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
  const founders = reactExports.useMemo(() => members.filter((member) => member.role === "founder"), [members]);
  const core = reactExports.useMemo(() => members.filter((member) => member.role === "core"), [members]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "members", eyebrow: "The Team", title: "Founding & Core Members", subtitle: "The people building Lexora — bringing vision, voice and rigour to a growing community." }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-primary", children: "Admin tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add, edit, and remove members. Name and image updates appear instantly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowForm(true), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add Member"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Founding Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-primary", children: "Where Lexora Began" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-12 md:grid-cols-3", children: founders.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MemberCard, { member: m, isAdmin, gold: true, onEdit: () => setEditingMember(m), onDelete: () => {
        if (!confirm(`Remove ${m.name}?`)) return;
        removeMember(m.id);
        logChange({
          actorEmail,
          actorRole,
          action: "member.remove",
          target: m.name,
          detail: `Removed ${m.role} member`
        });
        toast.success("Member removed");
      } }, m.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-secondary/40 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Core Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-primary", children: "Driving Lexora Forward" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4", children: core.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MemberCard, { member: m, isAdmin, onEdit: () => setEditingMember(m), onDelete: () => {
        if (!confirm(`Remove ${m.name}?`)) return;
        removeMember(m.id);
        logChange({
          actorEmail,
          actorRole,
          action: "member.remove",
          target: m.name,
          detail: `Removed ${m.role} member`
        });
        toast.success("Member removed");
      } }, m.id)) })
    ] }) }),
    (showForm || editingMember) && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(MemberDialog, { member: editingMember ?? void 0, onClose: () => {
      setShowForm(false);
      setEditingMember(null);
    }, actorEmail, actorRole, onSaved: () => {
      setShowForm(false);
      setEditingMember(null);
      load();
    } })
  ] });
}
function MemberDialog({
  member,
  onClose,
  actorEmail,
  actorRole,
  onSaved
}) {
  const isEditing = Boolean(member);
  const [form, setForm] = reactExports.useState({
    name: member?.name ?? "",
    image: member?.image ?? "",
    role: member?.role ?? "core"
  });
  const [saving, setSaving] = reactExports.useState(false);
  const onPickImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setForm((prev) => ({
        ...prev,
        image: result
      }));
    };
    reader.onerror = () => toast.error("Could not read image file.");
    reader.readAsDataURL(file);
  };
  const submit = (event) => {
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
          image
        });
        logChange({
          actorEmail,
          actorRole,
          action: "member.update",
          target: name,
          detail: `Updated member to ${form.role}`
        });
        toast.success("Member updated");
      } else {
        addMember({
          ...form,
          name,
          image
        });
        logChange({
          actorEmail,
          actorRole,
          action: "member.add",
          target: name,
          detail: `Added ${form.role} member`
        });
        toast.success("Member added");
      }
      onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save member", {
        description: message
      });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-muted-foreground hover:text-primary", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: isEditing ? "Edit Member" : "Add Member" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Update member name, image, and team role." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-5 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none", placeholder: "Member name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Role *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.role, onChange: (e) => setForm({
          ...form,
          role: e.target.value === "founder" ? "founder" : "core"
        }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "founder", children: "Founding Member" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "core", children: "Core Member" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Image URL or Data URL *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.image, onChange: (e) => setForm({
          ...form,
          image: e.target.value
        }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none", placeholder: "https://example.com/photo.jpg" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
        " Upload image file",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => onPickImage(e.target.files?.[0] ?? null) })
      ] }),
      form.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image, alt: "Member preview", className: "h-20 w-20 rounded-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: saving ? "Saving…" : isEditing ? "Save Changes" : "Add Member" })
      ] })
    ] })
  ] }) });
}
export {
  MembersPage as component
};

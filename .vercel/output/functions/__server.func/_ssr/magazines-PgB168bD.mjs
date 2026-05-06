import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout } from "./SiteLayout-JSk2rD_A.mjs";
import { P as PageHero } from "./PageHero-D0EAYh8H.mjs";
import { u as useAuth } from "./router-Bz0pR_Ai.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as isApplied, A as APPLIED_CHANGED_EVENT, m as markApplied } from "./applications-CxYEjjqA.mjs";
import { M as MAGAZINES_CHANGED_EVENT, r as removeMagazine, g as getMagazines, a as MAGAZINES_KEY, u as updateMagazine, b as addMagazine } from "./magazines-D21PTWll.mjs";
import { l as logChange } from "./change-log-C_6h4jB_.mjs";
import { P as Plus, C as Calendar, b as Clock, c as CircleCheck, A as ArrowRight, a as Pencil, T as Trash2, X } from "../_libs/lucide-react.mjs";
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
function MagazinesPage() {
  const {
    user,
    isAdmin,
    isProfileComplete,
    role
  } = useAuth();
  const [items, setItems] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingMagazine, setEditingMagazine] = reactExports.useState(null);
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";
  const load = () => {
    setItems(getMagazines());
  };
  reactExports.useEffect(() => {
    load();
    const onChanged = () => load();
    const onStorage = (event) => {
      if (event.key === null || event.key === MAGAZINES_KEY) {
        load();
      }
    };
    window.addEventListener(MAGAZINES_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MAGAZINES_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const sorted = reactExports.useMemo(() => {
    if (!items) return [];
    const now = Date.now();
    return [...items].sort((a, b) => {
      const aExp = new Date(a.deadline).getTime() < now;
      const bExp = new Date(b.deadline).getTime() < now;
      if (aExp !== bExp) return aExp ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [items]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "magazines", eyebrow: "Opportunities", title: "Internship Magazines", subtitle: "Curated internship opportunities. Sign in to apply and track your applications." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-6 pb-20", children: [
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-primary", children: "Admin tools" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add, manage and remove internship listings." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowForm(true), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Magazine"
        ] })
      ] }),
      items === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground", children: "Loading…" }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-primary", children: "No magazines yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isAdmin ? 'Click "New Magazine" to publish your first internship listing.' : "Check back soon — new opportunities are added regularly." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2", children: sorted.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MagazineCard, { m, isAdmin, isLoggedIn: Boolean(user), isProfileComplete, userEmail: user?.email ?? null, onEdit: () => setEditingMagazine(m), onDelete: () => {
        if (!confirm(`Delete "${m.title}"?`)) return;
        removeMagazine(m.id);
        logChange({
          actorEmail,
          actorRole,
          action: "magazine.remove",
          target: m.title,
          detail: `Removed magazine for ${m.organization}`
        });
        toast.success("Deleted");
        load();
      } }, m.id)) })
    ] }),
    showForm && isAdmin && user && /* @__PURE__ */ jsxRuntimeExports.jsx(NewMagazineDialog, { onClose: () => setShowForm(false), onSaved: () => {
      setShowForm(false);
      load();
    }, userEmail: user.email ?? null, actorRole }),
    editingMagazine && isAdmin && user && /* @__PURE__ */ jsxRuntimeExports.jsx(NewMagazineDialog, { magazine: editingMagazine, onClose: () => setEditingMagazine(null), onSaved: () => {
      setEditingMagazine(null);
      load();
    }, userEmail: user.email ?? null, actorRole })
  ] });
}
function MagazineCard({
  m,
  isAdmin,
  isLoggedIn,
  isProfileComplete,
  userEmail,
  onEdit,
  onDelete
}) {
  const expired = new Date(m.deadline).getTime() < Date.now();
  const [appliedNow, setAppliedNow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAppliedNow(isApplied(userEmail, m.id));
    const h = () => setAppliedNow(isApplied(userEmail, m.id));
    window.addEventListener(APPLIED_CHANGED_EVENT, h);
    return () => window.removeEventListener(APPLIED_CHANGED_EVENT, h);
  }, [userEmail, m.id]);
  const ensureCanApply = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in first", {
        description: "You must be logged in to register for internships.",
        action: {
          label: "Sign in",
          onClick: () => window.location.href = "/login"
        }
      });
      return false;
    }
    if (!isProfileComplete) {
      toast.error("Complete your profile first", {
        description: "Update first name, last name, course, and institute before applying.",
        action: {
          label: "Open profile",
          onClick: () => window.location.href = "/profile"
        }
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
    toast.loading("Opening registration form…", {
      id: m.id,
      duration: 1500
    });
    window.open(m.registration_link, "_blank", "noopener,noreferrer");
  };
  const handleMarkApplied = () => {
    if (!ensureCanApply() || !userEmail) return;
    markApplied(userEmail, {
      id: m.id,
      title: m.title,
      organization: m.organization,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
      link: m.registration_link,
      kind: "magazine",
      deadline: m.deadline
    });
    setTimeout(() => {
      toast.success("Marked as Applied", {
        id: m.id,
        description: "Added to your profile history."
      });
    }, 600);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-gold/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent", children: m.organization }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-xl text-primary", children: m.title })
      ] }),
      expired ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Closed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400", children: "Open" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 line-clamp-3 text-sm text-foreground/80", children: m.description }),
    m.tags && m.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: m.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground", children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-1 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
      " Deadline:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: expired ? "text-destructive" : "text-foreground", children: new Date(m.deadline).toLocaleString(void 0, {
        dateStyle: "medium",
        timeStyle: "short"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2", children: [
      expired ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
        " Closed"
      ] }) : appliedNow ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
        " Applied"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleOpenRegistration, className: "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-navy-deep transition hover:translate-y-[-1px]", style: {
          background: "var(--gradient-gold)",
          boxShadow: "var(--shadow-gold)"
        }, children: [
          "Apply Now ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleMarkApplied, className: "rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary", children: "Mark Applied" })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-primary", "aria-label": "Edit magazine", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10", "aria-label": "Delete magazine", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function NewMagazineDialog({
  magazine,
  onClose,
  onSaved,
  userEmail,
  actorRole
}) {
  const isEditing = Boolean(magazine);
  const [form, setForm] = reactExports.useState({
    title: magazine?.title ?? "",
    organization: magazine?.organization ?? "",
    description: magazine?.description ?? "",
    registration_link: magazine?.registration_link ?? "",
    deadline: magazine ? toDatetimeLocalValue(magazine.deadline) : "",
    tags: magazine?.tags?.join(", ") ?? ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.organization || !form.registration_link || !form.deadline) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSaving(true);
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        description: form.description.trim(),
        registration_link: form.registration_link.trim(),
        deadline: new Date(form.deadline).toISOString(),
        tags: tags.length ? tags : null,
        posted_by_email: userEmail
      };
      if (isEditing && magazine) {
        updateMagazine(magazine.id, payload);
        logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "magazine.update",
          target: payload.title,
          detail: `Updated magazine for ${payload.organization}`
        });
      } else {
        addMagazine(payload);
        logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "magazine.add",
          target: payload.title,
          detail: `Added magazine for ${payload.organization}`
        });
      }
      toast.success(isEditing ? "Opportunity updated" : "Opportunity published");
      onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save opportunity", {
        description: message
      });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-muted-foreground hover:text-primary", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: isEditing ? "Edit Internship Opportunity" : "New Internship Opportunity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: isEditing ? "Update details like deadline, description, or registration link." : "Publish a new opportunity for the community." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-5 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title *", value: form.title, onChange: (v) => setForm({
        ...form,
        title: v
      }), placeholder: "Research Intern — Constitutional Law" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Organization *", value: form.organization, onChange: (v) => setForm({
        ...form,
        organization: v
      }), placeholder: "Lexora Community" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }), rows: 3, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none", placeholder: "Brief overview of the role and responsibilities." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Registration Link *", value: form.registration_link, onChange: (v) => setForm({
        ...form,
        registration_link: v
      }), placeholder: "https://forms.gle/…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Deadline *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: form.deadline, onChange: (e) => setForm({
          ...form,
          deadline: e.target.value
        }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tags (comma separated)", value: form.tags, onChange: (v) => setForm({
        ...form,
        tags: v
      }), placeholder: "Remote, Law, 1 month" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: saving ? "Saving…" : isEditing ? "Save Changes" : "Publish" })
      ] })
    ] })
  ] }) });
}
function toDatetimeLocalValue(iso) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "";
  const offsetMs = dt.getTimezoneOffset() * 60 * 1e3;
  return new Date(dt.getTime() - offsetMs).toISOString().slice(0, 16);
}
function Field({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), placeholder, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
  ] });
}
export {
  MagazinesPage as component
};

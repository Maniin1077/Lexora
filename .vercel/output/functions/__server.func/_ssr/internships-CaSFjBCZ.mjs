import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout } from "./SiteLayout-CNsRNPbk.mjs";
import { P as PageHero } from "./PageHero-Bdx9kn1B.mjs";
import { u as useAuth } from "./router-DqURmC3W.mjs";
import { i as isApplied, A as APPLIED_CHANGED_EVENT, m as markApplied } from "./applications-vtjmiLxT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as INTERNSHIPS_CHANGED_EVENT, r as removeInternship, g as getInternships, a as INTERNSHIPS_KEY, u as updateInternship, b as addInternship } from "./internships-D3vOHvd9.mjs";
import { l as logChange } from "./change-log-ggNKkHy9.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function InternshipsPage() {
  const {
    user,
    isAdmin,
    isProfileComplete,
    role
  } = useAuth();
  const [items, setItems] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingInternship, setEditingInternship] = reactExports.useState(null);
  const actorEmail = user?.email ?? "unknown@lexora.local";
  const actorRole = role === "owner" ? "owner" : "admin";
  const load = () => {
    void getInternships().then(setItems);
  };
  reactExports.useEffect(() => {
    load();
    const onChanged = () => load();
    const onStorage = (event) => {
      if (event.key === null || event.key === INTERNSHIPS_KEY) {
        load();
      }
    };
    window.addEventListener(INTERNSHIPS_CHANGED_EVENT, onChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(INTERNSHIPS_CHANGED_EVENT, onChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const sorted = reactExports.useMemo(() => {
    if (!items) return [];
    const now = Date.now();
    return [...items].sort((a, b) => {
      const aClosed = new Date(a.deadline).getTime() < now;
      const bClosed = new Date(b.deadline).getTime() < now;
      if (aClosed !== bClosed) return aClosed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [items]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "internships", eyebrow: "Opportunities", title: "Internships", subtitle: "Apply for open opportunities and track your status by clicking Mark Applied after submission." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-6 pb-20", children: [
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between rounded-xl border border-gold/40 bg-gold/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-primary", children: "Admin tools" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add, edit, and remove internships including links and deadlines." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowForm(true), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Internship"
        ] })
      ] }),
      items === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground", children: "Loading…" }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-primary", children: "No internships yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: isAdmin ? 'Click "New Internship" to publish an opportunity.' : "Check back soon for new opportunities." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 md:grid-cols-2", children: sorted.map((internship) => /* @__PURE__ */ jsxRuntimeExports.jsx(InternshipCard, { internship, isAdmin, isLoggedIn: Boolean(user), isProfileComplete, userEmail: user?.email ?? null, onEdit: () => setEditingInternship(internship), onDelete: async () => {
        if (!confirm(`Delete "${internship.title}"?`)) return;
        void removeInternship(internship.id);
        logChange({
          actorEmail,
          actorRole,
          action: "internship.remove",
          target: internship.title,
          detail: `Removed internship from ${internship.organization}`
        });
        toast.success("Internship deleted");
        load();
      } }, internship.id)) })
    ] }),
    showForm && isAdmin && user && /* @__PURE__ */ jsxRuntimeExports.jsx(InternshipDialog, { onClose: () => setShowForm(false), onSaved: () => {
      setShowForm(false);
      load();
    }, userEmail: user.email ?? null, actorRole }),
    editingInternship && isAdmin && user && /* @__PURE__ */ jsxRuntimeExports.jsx(InternshipDialog, { internship: editingInternship, onClose: () => setEditingInternship(null), onSaved: () => {
      setEditingInternship(null);
      load();
    }, userEmail: user.email ?? null, actorRole })
  ] });
}
function InternshipCard({
  internship,
  isAdmin,
  isLoggedIn,
  isProfileComplete,
  userEmail,
  onEdit,
  onDelete
}) {
  const closed = new Date(internship.deadline).getTime() < Date.now();
  const [appliedNow, setAppliedNow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    void isApplied(userEmail, internship.id).then(setAppliedNow);
    const onAppliedChanged = () => {
      void isApplied(userEmail, internship.id).then(setAppliedNow);
    };
    window.addEventListener(APPLIED_CHANGED_EVENT, onAppliedChanged);
    return () => window.removeEventListener(APPLIED_CHANGED_EVENT, onAppliedChanged);
  }, [userEmail, internship.id]);
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
    if (closed) {
      toast.error("This internship is closed");
      return false;
    }
    return true;
  };
  const handleOpenRegistration = () => {
    if (!ensureCanApply()) return;
    toast.loading("Opening registration form…", {
      id: internship.id,
      duration: 1500
    });
    window.open(internship.registrationLink, "_blank", "noopener,noreferrer");
  };
  const handleMarkApplied = async () => {
    if (!ensureCanApply() || !userEmail) return;
    await markApplied(userEmail, {
      id: internship.id,
      title: internship.title,
      organization: internship.organization,
      appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
      link: internship.registrationLink,
      kind: "internship",
      deadline: internship.deadline
    });
    toast.success("Marked as Applied", {
      id: internship.id,
      description: "Added to your profile history."
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-gold/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent", children: internship.organization }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-display text-xl text-primary", children: internship.title })
      ] }),
      closed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Closed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400", children: "Open" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 line-clamp-3 text-sm text-foreground/80", children: internship.description }),
    internship.tags && internship.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: internship.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground", children: tag }, tag)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-1 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
      " Deadline:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: closed ? "text-destructive" : "text-foreground", children: new Date(internship.deadline).toLocaleString(void 0, {
        dateStyle: "medium",
        timeStyle: "short"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2", children: [
      closed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground", children: [
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
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-primary", "aria-label": "Edit internship", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/10", "aria-label": "Delete internship", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function InternshipDialog({
  internship,
  onClose,
  onSaved,
  userEmail,
  actorRole
}) {
  const isEditing = Boolean(internship);
  const [form, setForm] = reactExports.useState({
    title: internship?.title ?? "",
    organization: internship?.organization ?? "",
    description: internship?.description ?? "",
    registrationLink: internship?.registrationLink ?? "",
    deadline: internship ? toDatetimeLocalValue(internship.deadline) : "",
    tags: internship?.tags?.join(", ") ?? ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.organization || !form.registrationLink || !form.deadline) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSaving(true);
      const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        description: form.description.trim(),
        registrationLink: form.registrationLink.trim(),
        deadline: new Date(form.deadline).toISOString(),
        tags: tags.length ? tags : null,
        postedByEmail: userEmail
      };
      if (isEditing && internship) {
        await updateInternship(internship.id, payload);
        await logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "internship.update",
          target: payload.title,
          detail: `Updated internship for ${payload.organization}`
        });
      } else {
        await addInternship(payload);
        await logChange({
          actorEmail: userEmail ?? "unknown@lexora.local",
          actorRole,
          action: "internship.add",
          target: payload.title,
          detail: `Added internship for ${payload.organization}`
        });
      }
      toast.success(isEditing ? "Internship updated" : "Internship published");
      onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save internship", {
        description: message
      });
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-muted-foreground hover:text-primary", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: isEditing ? "Edit Internship" : "New Internship" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Add details, registration link, and deadline for this opportunity." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-5 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title *", value: form.title, onChange: (value) => setForm({
        ...form,
        title: value
      }), placeholder: "Research Intern — Constitutional Law" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Organization *", value: form.organization, onChange: (value) => setForm({
        ...form,
        organization: value
      }), placeholder: "Lexora Community" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }), rows: 3, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none", placeholder: "Brief overview of the role and responsibilities." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Registration Link *", value: form.registrationLink, onChange: (value) => setForm({
        ...form,
        registrationLink: value
      }), placeholder: "https://forms.gle/..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Deadline *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: form.deadline, onChange: (e) => setForm({
          ...form,
          deadline: e.target.value
        }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tags (comma separated)", value: form.tags, onChange: (value) => setForm({
        ...form,
        tags: value
      }), placeholder: "Remote, Law, 1 month" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saving, className: "rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: saving ? "Saving…" : isEditing ? "Save Changes" : "Publish" })
      ] })
    ] })
  ] }) });
}
function toDatetimeLocalValue(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60 * 1e3;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
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
  InternshipsPage as component
};

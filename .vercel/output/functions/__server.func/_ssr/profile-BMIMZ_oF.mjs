import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout } from "./SiteLayout-CNsRNPbk.mjs";
import { P as PageHero } from "./PageHero-Bdx9kn1B.mjs";
import { u as useAuth, s as supabase } from "./router-DqURmC3W.mjs";
import { A as APPLIED_CHANGED_EVENT, g as getApplied, r as removeApplied } from "./applications-vtjmiLxT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Mail, K as KeyRound, L as LockKeyhole, S as ShieldCheck, C as Calendar, T as Trash2 } from "../_libs/lucide-react.mjs";
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
async function readCurrentSecurityQuestion(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return "";
  const {
    data,
    error
  } = await supabase.from("user_profiles").select("security_question").eq("email", normalized).maybeSingle();
  if (error || !data) return "";
  return String(data.security_question ?? "").trim();
}
function ProfilePage() {
  const {
    user,
    loading,
    role,
    isAdmin,
    isProfileComplete,
    updateProfile,
    updatePassword,
    changeEmail,
    updateSecurityQuestion,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = reactExports.useState([]);
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [savingRecovery, setSavingRecovery] = reactExports.useState(false);
  const [savingCredentials, setSavingCredentials] = reactExports.useState(false);
  const [profileForm, setProfileForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    course: "",
    institute: ""
  });
  const [recoveryForm, setRecoveryForm] = reactExports.useState({
    securityQuestion: "",
    securityAnswer: ""
  });
  const [credentialForm, setCredentialForm] = reactExports.useState({
    currentPassword: "",
    newEmail: "",
    newPassword: ""
  });
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    const load = () => {
      void getApplied(user?.email).then(setApplied);
    };
    load();
    window.addEventListener(APPLIED_CHANGED_EVENT, load);
    return () => window.removeEventListener(APPLIED_CHANGED_EVENT, load);
  }, [user?.email]);
  reactExports.useEffect(() => {
    if (!user) return;
    void readCurrentSecurityQuestion(user.email).then((question) => setRecoveryForm({
      securityQuestion: question,
      securityAnswer: ""
    }));
    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      course: user.course,
      institute: user.institute
    });
    setCredentialForm({
      currentPassword: "",
      newEmail: user.email,
      newPassword: ""
    });
  }, [user?.email, user?.firstName, user?.lastName, user?.course, user?.institute]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md px-6 py-32 text-center text-muted-foreground", children: "Loading…" }) });
  }
  const name = `${user.firstName} ${user.lastName}`.trim() || user.email || "Member";
  const initials = (user.firstName || user.email || "M").charAt(0).toUpperCase();
  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileForm);
      toast.success("Profile saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save profile.", {
        description: message
      });
    } finally {
      setSavingProfile(false);
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout Successfully", {
        duration: 1500
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not log out", {
        description: message
      });
    }
  };
  const handleRecoverySave = async (event) => {
    event.preventDefault();
    if (!recoveryForm.securityQuestion.trim() || !recoveryForm.securityAnswer.trim()) {
      toast.error("Add both a security question and answer.");
      return;
    }
    try {
      setSavingRecovery(true);
      await updateSecurityQuestion(recoveryForm.securityQuestion, recoveryForm.securityAnswer);
      toast.success("Security question saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not save security question.", {
        description: message
      });
    } finally {
      setSavingRecovery(false);
    }
  };
  const handleCredentialSave = async (event) => {
    event.preventDefault();
    const currentPassword = credentialForm.currentPassword.trim();
    const newEmail = credentialForm.newEmail.trim();
    const newPassword = credentialForm.newPassword;
    if (!currentPassword) {
      toast.error("Enter your current password first.");
      return;
    }
    if (!newEmail && !newPassword) {
      toast.error("Add a new email or password to update credentials.");
      return;
    }
    if (newEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(newEmail)) {
        toast.error("Please enter a valid new email address.");
        return;
      }
      if (!newEmail.trim().toLowerCase().endsWith("@gmail.com")) {
        toast.error('Email must end with "@gmail.com".');
        return;
      }
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    try {
      setSavingCredentials(true);
      if (newPassword) {
        await updatePassword(currentPassword, newPassword);
        toast.success("Password updated successfully.");
      }
      if (newEmail) {
        await changeEmail(currentPassword, newEmail);
        toast.success("Email updated successfully.");
      }
      setCredentialForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: ""
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Could not update credentials.", {
        description: message
      });
    } finally {
      setSavingCredentials(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { contentKey: "profile", eyebrow: "Member Area", title: "My Profile", subtitle: "Your Lexora identity and application history." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-6 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gold/30 bg-card p-6 md:col-span-1", style: {
        boxShadow: "var(--shadow-elegant)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-2xl text-gold", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-lg text-primary", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 truncate text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
              " ",
              user.email
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleProfileSave, className: "mt-6 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "First Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profileForm.firstName, onChange: (e) => setProfileForm((prev) => ({
                ...prev,
                firstName: e.target.value
              })), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Last Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profileForm.lastName, onChange: (e) => setProfileForm((prev) => ({
                ...prev,
                lastName: e.target.value
              })), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Course" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profileForm.course, onChange: (e) => setProfileForm((prev) => ({
              ...prev,
              course: e.target.value
            })), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "College / University / Institute" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profileForm.institute, onChange: (e) => setProfileForm((prev) => ({
              ...prev,
              institute: e.target.value
            })), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Email ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: user.email, readOnly: true, className: "mt-1 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: savingProfile, className: "w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60", children: savingProfile ? "Saving…" : "Save Profile" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRecoverySave, className: "mt-4 space-y-3 rounded-md border border-border/80 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-left text-[11px] uppercase tracking-wide text-muted-foreground", children: "Recovery Question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
              " Security Question"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: recoveryForm.securityQuestion, onChange: (e) => setRecoveryForm((prev) => ({
              ...prev,
              securityQuestion: e.target.value
            })), placeholder: "e.g. What is my favorite city?", className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "h-3 w-3" }),
              " Security Answer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: recoveryForm.securityAnswer, onChange: (e) => setRecoveryForm((prev) => ({
              ...prev,
              securityAnswer: e.target.value
            })), placeholder: "Enter your answer", className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "This answer is used for password recovery." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: savingRecovery, className: "w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60", children: savingRecovery ? "Saving..." : "Save Recovery Question" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCredentialSave, className: "mt-4 space-y-3 rounded-md border border-border/80 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-left text-[11px] uppercase tracking-wide text-muted-foreground", children: "Account Credentials" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Current Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: credentialForm.currentPassword, onChange: (e) => setCredentialForm((prev) => ({
              ...prev,
              currentPassword: e.target.value
            })), placeholder: "Enter your current password", className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "New Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: credentialForm.newEmail, onChange: (e) => setCredentialForm((prev) => ({
              ...prev,
              newEmail: e.target.value
            })), placeholder: "anydemo@gmail.com", className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "New email must end with @gmail.com and cannot already be in use." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "New Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: credentialForm.newPassword, onChange: (e) => setCredentialForm((prev) => ({
              ...prev,
              newPassword: e.target.value
            })), placeholder: "Create a password (min 6 characters)", className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: savingCredentials, className: "w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60", children: savingCredentials ? "Updating..." : "Update Credentials" })
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-accent" }),
          role === "owner" ? "Owner" : "Administrator"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2 text-sm", children: [
          !isProfileComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300", children: "Complete and save your profile before applying for opportunities." }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "block rounded-md bg-primary px-4 py-2 text-center font-medium text-primary-foreground hover:opacity-90", children: "Open Admin Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSignOut, className: "block w-full rounded-md border border-border px-4 py-2 text-center font-medium text-foreground hover:bg-secondary", children: "Sign out" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-primary", children: "Applied Opportunities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            applied.length,
            " total"
          ] })
        ] }),
        applied.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You have not marked any opportunities as applied yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/internships", className: "inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Browse Internships" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/magazines", className: "inline-block rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-secondary", children: "Browse Magazines" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: applied.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(AppliedOpportunityRow, { item, userEmail: user.email }, item.id)) })
      ] })
    ] }) })
  ] });
}
function AppliedOpportunityRow({
  item,
  userEmail
}) {
  const closed = item.deadline ? new Date(item.deadline).getTime() < Date.now() : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-primary", children: item.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.organization }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          " Applied on ",
          new Date(item.appliedAt).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-secondary-foreground", children: item.kind === "magazine" ? "Magazine" : "Internship" }),
        closed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground", children: "Closed" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
      closed ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "inline-flex items-center gap-1 rounded-md bg-muted px-3 py-2 text-xs font-medium text-muted-foreground", children: "Closed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-secondary", children: "Open" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void removeApplied(userEmail, item.id), className: "inline-flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10", "aria-label": "Remove from history", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
    ] })
  ] });
}
export {
  ProfilePage as component
};

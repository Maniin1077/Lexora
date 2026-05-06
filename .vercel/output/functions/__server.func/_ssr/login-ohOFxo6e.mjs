import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout } from "./SiteLayout-B44v7Fkn.mjs";
import { u as useAuth, s as supabase } from "./router-DbNEfgxH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function hasLetter(value) {
  return /[a-z]/i.test(value);
}
function hasNumber(value) {
  return /\d/.test(value);
}
function hasSpecial(value) {
  return /[^a-z\d]/i.test(value);
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}
function LoginPage() {
  const {
    user,
    signInWithPassword,
    register,
    resetPassword,
    completePasswordReset,
    loading
  } = useAuth();
  const [mode, setMode] = reactExports.useState("signin");
  const [busy, setBusy] = reactExports.useState(false);
  const [signInForm, setSignInForm] = reactExports.useState({
    email: "",
    password: ""
  });
  const [createForm, setCreateForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    course: "",
    institute: "",
    email: "",
    password: ""
  });
  const [forgotForm, setForgotForm] = reactExports.useState({
    email: ""
  });
  const [resetForm, setResetForm] = reactExports.useState({
    newPassword: ""
  });
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/profile"
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    const bootstrapRecovery = async () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");
      if (!accessToken || !refreshToken || type !== "recovery") {
        return;
      }
      const {
        error
      } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      if (error) {
        toast.error("This password reset link is invalid or expired.");
        return;
      }
      window.history.replaceState({}, "", window.location.pathname);
      setMode("reset");
      toast.success("Reset link verified. Set your new password.");
    };
    void bootstrapRecovery();
  }, []);
  const createEmailError = reactExports.useMemo(() => {
    if (!createForm.email) return "";
    if (!createForm.email.includes("@")) {
      return "Email must include @ (example: your@email.com).";
    }
    if (!isValidEmail(createForm.email)) {
      return "Please enter a valid email domain (example: gmail.com).";
    }
    return "";
  }, [createForm.email]);
  const signInEmailError = reactExports.useMemo(() => {
    if (!signInForm.email) return "";
    if (!signInForm.email.includes("@")) {
      return "Email must include @.";
    }
    if (!isValidEmail(signInForm.email)) {
      return "Please enter a valid email format.";
    }
    return "";
  }, [signInForm.email]);
  const forgotEmailError = reactExports.useMemo(() => {
    if (!forgotForm.email) return "";
    if (!forgotForm.email.includes("@")) {
      return "Email must include @.";
    }
    if (!isValidEmail(forgotForm.email)) {
      return "Please enter a valid email format.";
    }
    return "";
  }, [forgotForm.email]);
  const createPasswordChecks = reactExports.useMemo(() => ({
    minLength: createForm.password.length >= 6,
    letter: hasLetter(createForm.password),
    number: hasNumber(createForm.password),
    special: hasSpecial(createForm.password)
  }), [createForm.password]);
  const resetPasswordChecks = reactExports.useMemo(() => ({
    minLength: resetForm.newPassword.length >= 6,
    letter: hasLetter(resetForm.newPassword),
    number: hasNumber(resetForm.newPassword),
    special: hasSpecial(resetForm.newPassword)
  }), [resetForm.newPassword]);
  const handlePasswordSignIn = async (event) => {
    event.preventDefault();
    if (signInEmailError) {
      toast.error(signInEmailError);
      return;
    }
    try {
      setBusy(true);
      await signInWithPassword(signInForm.email, signInForm.password);
      toast.success("Login successful", {
        duration: 1500
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Sign in failed.", {
        description: message
      });
    } finally {
      setBusy(false);
    }
  };
  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (createEmailError) {
      toast.error(createEmailError);
      return;
    }
    if (!createPasswordChecks.minLength) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      setBusy(true);
      await register(createForm);
      toast.success("Account created. Verify your email before signing in.");
      setCreateForm({
        firstName: "",
        lastName: "",
        course: "",
        institute: "",
        email: "",
        password: ""
      });
      setMode("signin");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not create account.", {
        description: message
      });
    } finally {
      setBusy(false);
    }
  };
  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (forgotEmailError) {
      toast.error(forgotEmailError);
      return;
    }
    try {
      setBusy(true);
      await resetPassword(forgotForm.email);
      toast.success("Reset link sent. Please check your email inbox.");
      setForgotForm({
        email: ""
      });
      setMode("signin");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not send reset email.", {
        description: message
      });
    } finally {
      setBusy(false);
    }
  };
  const handleCompleteReset = async (event) => {
    event.preventDefault();
    if (!resetPasswordChecks.minLength) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      setBusy(true);
      await completePasswordReset(resetForm.newPassword);
      toast.success("Password updated. You can now sign in.");
      setResetForm({
        newPassword: ""
      });
      setMode("signin");
      await supabase.auth.signOut();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not reset password.", {
        description: message
      });
    } finally {
      setBusy(false);
    }
  };
  const titleByMode = {
    signin: "Sign in to continue",
    create: "Create your account",
    forgot: "Forgot your password",
    reset: "Set a new password"
  };
  const subtitleByMode = {
    signin: "Sign in with your verified email and password.",
    create: "Create an account and verify your email before first login.",
    forgot: "Enter your email. We will send a secure password reset link.",
    reset: "Enter a new password for your account."
  };
  const validationTextClass = "mt-1 text-[11px]";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full rounded-2xl border border-gold/30 bg-card p-10 text-center", style: {
    boxShadow: "var(--shadow-elegant)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Welcome to Lexora" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-3xl text-primary", children: titleByMode[mode] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: subtitleByMode[mode] }),
    mode === "signin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePasswordSignIn, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: signInForm.email, onChange: (e) => setSignInForm((prev) => ({
          ...prev,
          email: e.target.value
        })), placeholder: "e.g. your@email.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        signInEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: signInEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: signInForm.password, onChange: (e) => setSignInForm((prev) => ({
          ...prev,
          password: e.target.value
        })), placeholder: "Create a password (min 6 characters)", autoComplete: "current-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("forgot"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Forgot password?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("create"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Signing in..." : "Sign in" })
    ] }),
    mode === "create" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateAccount, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "First Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.firstName, onChange: (e) => setCreateForm((prev) => ({
            ...prev,
            firstName: e.target.value
          })), placeholder: "e.g. John", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.lastName, onChange: (e) => setCreateForm((prev) => ({
            ...prev,
            lastName: e.target.value
          })), placeholder: "e.g. Doe", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Course" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.course, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          course: e.target.value
        })), placeholder: "e.g. BA, LLB, BBA, MBA", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "College / University / Institute" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.institute, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          institute: e.target.value
        })), placeholder: "e.g. Delhi University", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: createForm.email, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          email: e.target.value
        })), placeholder: "e.g. your@email.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        createEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: createEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: createForm.password, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          password: e.target.value
        })), placeholder: "Create a password (min 6 characters)", autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} ${createPasswordChecks.minLength ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`, children: createPasswordChecks.minLength ? "Password length looks good." : "Password must be at least 6 characters." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
          "Strength hints: ",
          createPasswordChecks.letter ? "letter" : "no letter",
          ", ",
          " ",
          createPasswordChecks.number ? "number" : "no number",
          ", ",
          " ",
          createPasswordChecks.special ? "special character" : "no special character"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Creating account..." : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Already have an account? Sign in" })
    ] }),
    mode === "forgot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleForgotPassword, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: forgotForm.email, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          email: e.target.value
        })), placeholder: "e.g. your@email.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        forgotEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: forgotEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Sending link..." : "Reset password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Back to sign in" })
    ] }),
    mode === "reset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCompleteReset, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "New Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: resetForm.newPassword, onChange: (e) => setResetForm((prev) => ({
          ...prev,
          newPassword: e.target.value
        })), placeholder: "Create a password (min 6 characters)", autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} ${resetPasswordChecks.minLength ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`, children: resetPasswordChecks.minLength ? "Password length looks good." : "Password must be at least 6 characters." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
          "Strength hints: ",
          resetPasswordChecks.letter ? "letter" : "no letter",
          ", ",
          " ",
          resetPasswordChecks.number ? "number" : "no number",
          ", ",
          " ",
          resetPasswordChecks.special ? "special character" : "no special character"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Updating password..." : "Set new password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline", children: "Back to home" })
  ] }) }) });
}
export {
  LoginPage as component
};

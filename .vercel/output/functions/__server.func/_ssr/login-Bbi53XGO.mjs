import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout } from "./SiteLayout-CNsRNPbk.mjs";
import { u as useAuth } from "./router-DqURmC3W.mjs";
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
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}
function isGmailEmail(value) {
  return value.trim().toLowerCase().endsWith("@gmail.com");
}
function LoginPage() {
  const {
    user,
    signInWithPassword,
    register,
    requestPasswordReset,
    completePasswordReset,
    loading
  } = useAuth();
  const [mode, setMode] = reactExports.useState("signin");
  const [forgotStep, setForgotStep] = reactExports.useState("email");
  const [forgotQuestion, setForgotQuestion] = reactExports.useState("");
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
    email: "",
    securityAnswer: "",
    newPassword: ""
  });
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/profile"
    });
  }, [loading, user, navigate]);
  const createEmailError = reactExports.useMemo(() => {
    if (!createForm.email) return "";
    if (!createForm.email.includes("@")) {
      return "Email must include @ (example: your@email.com).";
    }
    if (!isValidEmail(createForm.email)) {
      return "Please enter a valid email domain (example: gmail.com).";
    }
    if (!isGmailEmail(createForm.email)) {
      return 'Email must end with "@gmail.com".';
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
  const createPasswordReady = createForm.password.length >= 6;
  const forgotPasswordReady = forgotForm.newPassword.length >= 6;
  const titleByMode = {
    signin: "Sign in to continue",
    create: "Create your account",
    forgot: forgotStep === "email" ? "Forgot your password" : "Answer your security question"
  };
  const subtitleByMode = {
    signin: "Sign in with your verified email and password.",
    create: "Create an account and keep your recovery details updated in your profile.",
    forgot: forgotStep === "email" ? "Enter your email to load the security question saved on your account." : "Answer your security question and choose a new password."
  };
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
    if (!createPasswordReady) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      setBusy(true);
      await register(createForm);
      toast.success("Account created. You are now signed in.");
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
    if (forgotStep === "email" && forgotEmailError) {
      toast.error(forgotEmailError);
      return;
    }
    try {
      setBusy(true);
      if (forgotStep === "email") {
        const question = await requestPasswordReset(forgotForm.email);
        setForgotQuestion(question);
        setForgotStep("reset");
        toast.success("Security question loaded. Answer it to continue.");
        return;
      }
      if (!forgotPasswordReady) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
      await completePasswordReset(forgotForm.email, forgotForm.securityAnswer, forgotForm.newPassword);
      toast.success("Password updated. You can now sign in.");
      setSignInForm((prev) => ({
        ...prev,
        email: forgotForm.email
      }));
      setForgotForm({
        email: "",
        securityAnswer: "",
        newPassword: ""
      });
      setForgotQuestion("");
      setForgotStep("email");
      setMode("signin");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not reset password.", {
        description: message
      });
    } finally {
      setBusy(false);
    }
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
        })), placeholder: "anydemo@gmail.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        signInEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: signInEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: signInForm.password, onChange: (e) => setSignInForm((prev) => ({
          ...prev,
          password: e.target.value
        })), autoComplete: "current-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setMode("forgot");
          setForgotStep("email");
          setForgotQuestion("");
          setForgotForm({
            email: "",
            securityAnswer: "",
            newPassword: ""
          });
        }, className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Forgot password?" }),
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
        })), placeholder: "anydemo@gmail.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        createEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: createEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: createForm.password, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          password: e.target.value
        })), placeholder: "Create a password (min 6 characters)", autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} ${createPasswordReady ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`, children: createPasswordReady ? "Password length looks good." : "Password must be at least 6 characters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Creating account..." : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Already have an account? Sign in" })
    ] }),
    mode === "forgot" && /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleForgotPassword, className: "mt-8 space-y-4 text-left", children: forgotStep === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: forgotForm.email, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          email: e.target.value
        })), placeholder: "anydemo@gmail.com", autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        forgotEmailError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} text-destructive`, children: forgotEmailError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The account must already have a security question saved in profile settings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Back to sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("create"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Checking account..." : "Find security question" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/40 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Security Question" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground", children: forgotQuestion })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Security Answer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: forgotForm.securityAnswer, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          securityAnswer: e.target.value
        })), placeholder: "Enter your answer", autoComplete: "off", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "New Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: forgotForm.newPassword, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          newPassword: e.target.value
        })), placeholder: "Create a password (min 6 characters)", autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `${validationTextClass} ${forgotPasswordReady ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`, children: forgotPasswordReady ? "Password length looks good." : "Password must be at least 6 characters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setForgotStep("email");
          setForgotQuestion("");
          setForgotForm((prev) => ({
            ...prev,
            securityAnswer: "",
            newPassword: ""
          }));
        }, className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Use a different email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("create"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Updating password..." : "Reset password" })
    ] }) })
  ] }) }) });
}
export {
  LoginPage as component
};

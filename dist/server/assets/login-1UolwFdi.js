import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-LzKgK4ed.js";
import { u as useAuth, a as useNavigate, L as Link, t as toast } from "./router-tfM_rQOp.js";
import { S as SiteLayout } from "./SiteLayout-6lkPLzPj.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function LoginPage() {
  const {
    user,
    signInWithPassword,
    register,
    resetPassword,
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
    email: "",
    newPassword: ""
  });
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/profile"
    });
  }, [loading, user, navigate]);
  const handlePasswordSignIn = async (event) => {
    event.preventDefault();
    try {
      setBusy(true);
      await signInWithPassword(signInForm.email, signInForm.password);
      toast.success("Login Successful", {
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
    try {
      setBusy(true);
      await register(createForm);
      const firstName = createForm.firstName.trim();
      toast.success(firstName ? `Account created. Hey, ${firstName}!` : "Account created.");
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
    try {
      setBusy(true);
      await resetPassword(forgotForm.email, forgotForm.newPassword);
      toast.success("Password updated. Please sign in.");
      setSignInForm((prev) => ({
        ...prev,
        email: forgotForm.email
      }));
      setForgotForm({
        email: "",
        newPassword: ""
      });
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
  const titleByMode = {
    signin: "Sign in to continue",
    create: "Create your account",
    forgot: "Reset your password"
  };
  const subtitleByMode = {
    signin: "Sign in with your email and password.",
    create: "Create an account to apply for internships and manage your profile.",
    forgot: "Reset your password locally by entering your email and a new password."
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full rounded-2xl border border-gold/30 bg-card p-10 text-center", style: {
    boxShadow: "var(--shadow-elegant)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Welcome to Lexora" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-3xl text-primary", children: titleByMode[mode] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: subtitleByMode[mode] }),
    mode === "signin" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePasswordSignIn, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: signInForm.email, onChange: (e) => setSignInForm((prev) => ({
          ...prev,
          email: e.target.value
        })), autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: signInForm.password, onChange: (e) => setSignInForm((prev) => ({
          ...prev,
          password: e.target.value
        })), autoComplete: "current-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("forgot"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Forgot password?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("create"), className: "text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Signing in…" : "Sign in" })
    ] }) }),
    mode === "create" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateAccount, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "First Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.firstName, onChange: (e) => setCreateForm((prev) => ({
            ...prev,
            firstName: e.target.value
          })), required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.lastName, onChange: (e) => setCreateForm((prev) => ({
            ...prev,
            lastName: e.target.value
          })), required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Course" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.course, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          course: e.target.value
        })), required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "College / University / Institute" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: createForm.institute, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          institute: e.target.value
        })), required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: createForm.email, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          email: e.target.value
        })), autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: createForm.password, onChange: (e) => setCreateForm((prev) => ({
          ...prev,
          password: e.target.value
        })), autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Creating account…" : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Already have an account? Sign in" })
    ] }),
    mode === "forgot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleForgotPassword, className: "mt-8 space-y-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Email ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: forgotForm.email, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          email: e.target.value
        })), autoComplete: "email", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "New Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: forgotForm.newPassword, onChange: (e) => setForgotForm((prev) => ({
          ...prev,
          newPassword: e.target.value
        })), autoComplete: "new-password", required: true, className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: busy ? "Updating password…" : "Reset password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline", children: "Back to sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-muted-foreground", children: "Accounts are stored in local storage for this website environment." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-4 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline", children: "Back to home" })
  ] }) }) });
}
export {
  LoginPage as component
};

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Lexora Community" },
      {
        name: "description",
        content:
          "Sign in to Lexora with email/password, create an account, and recover your password.",
      },
    ],
  }),
  component: LoginPage,
});

type AuthMode = "signin" | "create" | "forgot" | "reset";

function hasLetter(value: string) {
  return /[a-z]/i.test(value);
}

function hasNumber(value: string) {
  return /\d/.test(value);
}

function hasSpecial(value: string) {
  return /[^a-z\d]/i.test(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function LoginPage() {
  const {
    user,
    signInWithPassword,
    register,
    resetPassword,
    completePasswordReset,
    loading,
  } = useAuth();

  

  const [mode, setMode] = useState<AuthMode>("signin");
  const [busy, setBusy] = useState(false);

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    course: "",
    institute: "",
    email: "",
    password: "",
  });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [resetForm, setResetForm] = useState({ newPassword: "" });

  

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [loading, user, navigate]);

  useEffect(() => {
    const bootstrapRecovery = async () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (!accessToken || !refreshToken || type !== "recovery") {
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
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

  const createEmailError = useMemo(() => {
    if (!createForm.email) return "";
    if (!createForm.email.includes("@")) {
      return "Email must include @ (example: your@email.com).";
    }
    if (!isValidEmail(createForm.email)) {
      return "Please enter a valid email domain (example: gmail.com).";
    }
    return "";
  }, [createForm.email]);

  const signInEmailError = useMemo(() => {
    if (!signInForm.email) return "";
    if (!signInForm.email.includes("@")) {
      return "Email must include @.";
    }
    if (!isValidEmail(signInForm.email)) {
      return "Please enter a valid email format.";
    }
    return "";
  }, [signInForm.email]);

  const forgotEmailError = useMemo(() => {
    if (!forgotForm.email) return "";
    if (!forgotForm.email.includes("@")) {
      return "Email must include @.";
    }
    if (!isValidEmail(forgotForm.email)) {
      return "Please enter a valid email format.";
    }
    return "";
  }, [forgotForm.email]);

  const createPasswordChecks = useMemo(
    () => ({
      minLength: createForm.password.length >= 6,
      letter: hasLetter(createForm.password),
      number: hasNumber(createForm.password),
      special: hasSpecial(createForm.password),
    }),
    [createForm.password],
  );

  const resetPasswordChecks = useMemo(
    () => ({
      minLength: resetForm.newPassword.length >= 6,
      letter: hasLetter(resetForm.newPassword),
      number: hasNumber(resetForm.newPassword),
      special: hasSpecial(resetForm.newPassword),
    }),
    [resetForm.newPassword],
  );

  const handlePasswordSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (signInEmailError) {
      toast.error(signInEmailError);
      return;
    }
    try {
      setBusy(true);
      await signInWithPassword(signInForm.email, signInForm.password);
      toast.success("Login successful", { duration: 1500 });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Sign in failed.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
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
        password: "",
      });
      
      setMode("signin");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not create account.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (forgotEmailError) {
      toast.error(forgotEmailError);
      return;
    }

    try {
      setBusy(true);
      await resetPassword(forgotForm.email);
      toast.success("Reset link sent. Please check your email inbox.");
      setForgotForm({ email: "" });
      setMode("signin");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not send reset email.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleCompleteReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resetPasswordChecks.minLength) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setBusy(true);
      await completePasswordReset(resetForm.newPassword);
      toast.success("Password updated. You can now sign in.");
      setResetForm({ newPassword: "" });
      setMode("signin");
      await supabase.auth.signOut();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not reset password.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const titleByMode: Record<AuthMode, string> = {
    signin: "Sign in to continue",
    create: "Create your account",
    forgot: "Forgot your password",
    reset: "Set a new password",
  };

  const subtitleByMode: Record<AuthMode, string> = {
    signin: "Sign in with your verified email and password.",
    create: "Create an account and verify your email before first login.",
    forgot: "Enter your email. We will send a secure password reset link.",
    reset: "Enter a new password for your account.",
  };

  const validationTextClass = "mt-1 text-[11px]";

  return (
    <SiteLayout>
      <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-20">
        <div
          className="w-full rounded-2xl border border-gold/30 bg-card p-10 text-center"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            Welcome to Lexora
          </p>
          <h1 className="mt-3 font-display text-3xl text-primary">
            {titleByMode[mode]}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{subtitleByMode[mode]}</p>

          

          {mode === "signin" && (
            <form onSubmit={handlePasswordSignIn} className="mt-8 space-y-4 text-left">
              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email Address
                </span>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g. your@email.com"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
                {signInEmailError && (
                  <p className={`${validationTextClass} text-destructive`}>{signInEmailError}</p>
                )}
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Password
                </span>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Create a password (min 6 characters)"
                  autoComplete="current-password"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode("create")}
                  className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Create account
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {mode === "create" && (
            <form onSubmit={handleCreateAccount} className="mt-8 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    First Name
                  </span>
                  <input
                    type="text"
                    value={createForm.firstName}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder="e.g. John"
                    required
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Last Name
                  </span>
                  <input
                    type="text"
                    value={createForm.lastName}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    placeholder="e.g. Doe"
                    required
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Course
                </span>
                <input
                  type="text"
                  value={createForm.course}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, course: e.target.value }))
                  }
                  placeholder="e.g. BA, LLB, BBA, MBA"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  College / University / Institute
                </span>
                <input
                  type="text"
                  value={createForm.institute}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, institute: e.target.value }))
                  }
                  placeholder="e.g. Delhi University"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email Address
                </span>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g. your@email.com"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
                {createEmailError && (
                  <p className={`${validationTextClass} text-destructive`}>{createEmailError}</p>
                )}
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Password
                </span>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Create a password (min 6 characters)"
                  autoComplete="new-password"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
                <p
                  className={`${validationTextClass} ${
                    createPasswordChecks.minLength
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {createPasswordChecks.minLength
                    ? "Password length looks good."
                    : "Password must be at least 6 characters."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Strength hints: {createPasswordChecks.letter ? "letter" : "no letter"}, {" "}
                  {createPasswordChecks.number ? "number" : "no number"}, {" "}
                  {createPasswordChecks.special ? "special character" : "no special character"}
                </p>
              </label>

              

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Creating account..." : "Create account"}
              </button>

              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="mt-8 space-y-4 text-left">
              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email Address
                </span>
                <input
                  type="email"
                  value={forgotForm.email}
                  onChange={(e) =>
                    setForgotForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g. your@email.com"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
                {forgotEmailError && (
                  <p className={`${validationTextClass} text-destructive`}>{forgotEmailError}</p>
                )}
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Sending link..." : "Reset password"}
              </button>

              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Back to sign in
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={handleCompleteReset} className="mt-8 space-y-4 text-left">
              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  New Password
                </span>
                <input
                  type="password"
                  value={resetForm.newPassword}
                  onChange={(e) =>
                    setResetForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="Create a password (min 6 characters)"
                  autoComplete="new-password"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
                <p
                  className={`${validationTextClass} ${
                    resetPasswordChecks.minLength
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {resetPasswordChecks.minLength
                    ? "Password length looks good."
                    : "Password must be at least 6 characters."}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Strength hints: {resetPasswordChecks.letter ? "letter" : "no letter"}, {" "}
                  {resetPasswordChecks.number ? "number" : "no number"}, {" "}
                  {resetPasswordChecks.special ? "special character" : "no special character"}
                </p>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Updating password..." : "Set new password"}
              </button>
            </form>
          )}

          <Link
            to="/"
            className="mt-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

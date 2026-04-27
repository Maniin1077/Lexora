import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { FormEvent, useEffect, useState } from "react";
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

type AuthMode = "signin" | "create" | "forgot";

function LoginPage() {
  const {
    user,
    signInWithPassword,
    register,
    resetPassword,
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
  const [forgotForm, setForgotForm] = useState({ email: "", newPassword: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [loading, user, navigate]);

  const handlePasswordSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setBusy(true);
      await signInWithPassword(signInForm.email, signInForm.password);
      toast.success("Login Successful", { duration: 1500 });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Sign in failed.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setBusy(true);
      await register(createForm);
      const firstName = createForm.firstName.trim();
      toast.success(
        firstName ? `Account created. Hey, ${firstName}!` : "Account created.",
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error("Could not create account.", { description: message });
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setBusy(true);
      await resetPassword(forgotForm.email, forgotForm.newPassword);
      toast.success("Password updated. Please sign in.");
      setSignInForm((prev) => ({ ...prev, email: forgotForm.email }));
      setForgotForm({ email: "", newPassword: "" });
      setMode("signin");
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
    forgot: "Reset your password",
  };

  const subtitleByMode: Record<AuthMode, string> = {
    signin: "Sign in with your email and password.",
    create:
      "Create an account to apply for internships and manage your profile.",
    forgot:
      "Reset your password locally by entering your email and a new password.",
  };

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
          <p className="mt-3 text-sm text-muted-foreground">
            {subtitleByMode[mode]}
          </p>

          {mode === "signin" && (
            <>
              <form onSubmit={handlePasswordSignIn} className="mt-8 space-y-4 text-left">
                <label className="block">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email ID
                  </span>
                  <input
                    type="email"
                    value={signInForm.email}
                    onChange={(e) =>
                      setSignInForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    autoComplete="email"
                    required
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                  />
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
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </>
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
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email ID
                </span>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
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
                  autoComplete="new-password"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Creating account…" : "Create account"}
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
                  Email ID
                </span>
                <input
                  type="email"
                  value={forgotForm.email}
                  onChange={(e) =>
                    setForgotForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  New Password
                </span>
                <input
                  type="password"
                  value={forgotForm.newPassword}
                  onChange={(e) =>
                    setForgotForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  autoComplete="new-password"
                  required
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/70"
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "Updating password…" : "Reset password"}
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

          <p className="mt-6 text-xs text-muted-foreground">
            Accounts are stored in local storage for this website environment.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-Bxd5K0ek.css";
function createSupabaseClient() {
  const SUPABASE_URL = "https://zkzoweebzbakvjfmvwua.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprem93ZWViemJha3ZqZm12d3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzY3MzUsImV4cCI6MjA5MjcxMjczNX0.05ClT6SZJUr0kyKz9cZBkEVv6mUxjHk5DBcPDn08PSs";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy(
  {},
  {
    get(_, prop, receiver) {
      if (!_supabase) _supabase = createSupabaseClient();
      return Reflect.get(_supabase, prop, receiver);
    }
  }
);
const AUTH_ACCOUNTS_KEY = "lexora.auth.accounts";
const AUTH_ADMIN_EMAILS_KEY = "lexora.auth.admin-emails";
const AUTH_OWNER_EMAILS_KEY = "lexora.auth.owner-emails";
const AUTH_CHANGED_EVENT = "lexora:auth-changed";
const DEFAULT_OWNER_EMAIL = "bsmanikanta2004@gmail.com";
const SYSTEM_ADMIN_EMAIL = "lexora.community@gmail.com";
const MAX_ADMINS = 2;
const Ctx = reactExports.createContext(void 0);
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function dispatchAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
function readProfiles() {
  if (typeof window === "undefined") return [];
  const raw = safeParse(
    localStorage.getItem(AUTH_ACCOUNTS_KEY),
    []
  );
  const normalized = raw.map((item) => {
    const email = normalizeEmail(String(item.email ?? ""));
    const id = String(item.id ?? "").trim() || makeId();
    const createdAt = String(item.createdAt ?? "").trim() || (/* @__PURE__ */ new Date()).toISOString();
    return {
      id,
      firstName: String(item.firstName ?? "").trim(),
      lastName: String(item.lastName ?? "").trim(),
      course: String(item.course ?? "").trim(),
      institute: String(item.institute ?? "").trim(),
      email,
      createdAt
    };
  }).filter((item) => item.email.length > 0);
  return normalized;
}
function writeProfiles(profiles) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(profiles));
  dispatchAuthChanged();
}
function sanitizeOwnerEmails(raw) {
  const owners = [DEFAULT_OWNER_EMAIL, ...raw].map(normalizeEmail).filter(Boolean);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const owner of owners) {
    if (seen.has(owner)) continue;
    seen.add(owner);
    normalized.push(owner);
  }
  return normalized;
}
function readOwnerEmails() {
  if (typeof window === "undefined") return [DEFAULT_OWNER_EMAIL];
  const raw = safeParse(
    localStorage.getItem(AUTH_OWNER_EMAILS_KEY),
    [DEFAULT_OWNER_EMAIL]
  );
  const normalized = sanitizeOwnerEmails(raw);
  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}
function sanitizeAdminEmails(raw, owners) {
  const ownerSet = new Set(owners);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of raw) {
    const email = normalizeEmail(value);
    if (!email || ownerSet.has(email) || email === SYSTEM_ADMIN_EMAIL || seen.has(email)) {
      continue;
    }
    seen.add(email);
    normalized.push(email);
    if (normalized.length >= MAX_ADMINS) break;
  }
  return normalized;
}
function readAdminEmails() {
  if (typeof window === "undefined") return [];
  const owners = readOwnerEmails();
  const raw = safeParse(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    []
  );
  const normalized = sanitizeAdminEmails(raw, owners);
  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  }
  return normalized;
}
function writeAdminEmails(emails) {
  if (typeof window === "undefined") return;
  const normalized = sanitizeAdminEmails(emails, readOwnerEmails());
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  dispatchAuthChanged();
}
function writeOwnerEmails(emails) {
  if (typeof window === "undefined") return;
  const owners = sanitizeOwnerEmails(emails);
  localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(owners));
  const admins = safeParse(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    []
  );
  const sanitizedAdmins = sanitizeAdminEmails(admins, owners);
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(sanitizedAdmins));
  dispatchAuthChanged();
}
function getUserRole(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  if (!normalizedEmail) return "user";
  const owners = readOwnerEmails();
  if (owners.includes(normalizedEmail)) return "owner";
  if (normalizedEmail === SYSTEM_ADMIN_EMAIL) return "admin";
  const admins = readAdminEmails();
  if (admins.includes(normalizedEmail)) return "admin";
  return "user";
}
function toAdminRecord(account) {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    course: account.course,
    institute: account.institute,
    email: account.email,
    createdAt: account.createdAt
  };
}
function getAllUsersForAdmin() {
  return readProfiles().map(toAdminRecord).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
function hasCompleteProfile(user) {
  if (!user) return false;
  return [
    user.firstName,
    user.lastName,
    user.course,
    user.institute,
    user.email
  ].every((value) => value.trim().length > 0);
}
function toAuthUser(profile) {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    course: profile.course,
    institute: profile.institute,
    email: profile.email
  };
}
function inferAuthErrorMessage(error, fallback) {
  const raw = error instanceof Error ? error.message : String(error);
  const message = raw.toLowerCase();
  if (message.includes("email not confirmed") || message.includes("email not verified")) {
    return "Please verify your email before logging in.";
  }
  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (message.includes("user already registered")) {
    return "An account with this email already exists.";
  }
  if (message.includes("captcha")) {
    return "CAPTCHA validation failed. Please try again.";
  }
  if (message.includes("password") && message.includes("6")) {
    return "Password must be at least 6 characters.";
  }
  return raw || fallback;
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}
function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  const fromEnv = "http://localhost:5173";
  return fromEnv;
}
function mergeProfileFromUser(existing, authUser) {
  const normalizedEmail = normalizeEmail(authUser.email ?? "");
  return {
    id: existing?.id ?? authUser.id,
    firstName: existing?.firstName ?? "",
    lastName: existing?.lastName ?? "",
    course: existing?.course ?? "",
    institute: existing?.institute ?? "",
    email: normalizedEmail,
    createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
function upsertProfile(record) {
  const profiles = readProfiles();
  const idx = profiles.findIndex(
    (item) => item.id === record.id || item.email === record.email
  );
  if (idx === -1) {
    writeProfiles([record, ...profiles]);
    return record;
  }
  const merged = {
    ...profiles[idx],
    ...record,
    id: profiles[idx].id || record.id,
    createdAt: profiles[idx].createdAt || record.createdAt
  };
  const next = [...profiles];
  next[idx] = merged;
  writeProfiles(next);
  return merged;
}
function ensureRegisteredEmail(email) {
  const normalized = normalizeEmail(email);
  const exists = readProfiles().some((account) => account.email === normalized);
  if (!exists) {
    throw new Error("Only registered users can be granted elevated access.");
  }
}
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    const hydrateFromSupabaseUser = async (supabaseUser) => {
      if (!mounted) return;
      if (!supabaseUser || !supabaseUser.email) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (!supabaseUser.email_confirmed_at) {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }
      const profiles = readProfiles();
      const existing = profiles.find((item) => item.id === supabaseUser.id) ?? profiles.find((item) => item.email === normalizeEmail(supabaseUser.email ?? "")) ?? null;
      const mergedProfile = mergeProfileFromUser(existing, supabaseUser);
      const persistedProfile = upsertProfile(mergedProfile);
      if (mounted) {
        setUser(toAuthUser(persistedProfile));
        setLoading(false);
      }
    };
    const hydrate = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setUser(null);
          return;
        }
        await hydrateFromSupabaseUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void hydrate();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrateFromSupabaseUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signInWithPassword = async (email, password, captchaToken) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
      throw new Error("Email and password are required.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!captchaToken) {
      throw new Error("Please complete CAPTCHA.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
      options: {
        captchaToken
      }
    });
    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not sign in."));
    }
    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error("Please verify your email before logging in.");
    }
  };
  const register = async (input, captchaToken) => {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const course = input.course.trim();
    const institute = input.institute.trim();
    const email = normalizeEmail(input.email);
    const password = input.password;
    if (!firstName || !lastName || !course || !institute || !email || !password) {
      throw new Error("Please fill all fields.");
    }
    if (!validEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    if (!captchaToken) {
      throw new Error("Please complete CAPTCHA.");
    }
    const profileSeed = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    upsertProfile(profileSeed);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        emailRedirectTo: `${getBaseUrl()}/login`
      }
    });
    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not create account."));
    }
    await supabase.auth.signOut();
  };
  const updateProfile = async (input) => {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }
    const profile = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      course: input.course.trim(),
      institute: input.institute.trim()
    };
    if (!profile.firstName || !profile.lastName || !profile.course || !profile.institute) {
      throw new Error("Please fill all profile fields.");
    }
    const existing = readProfiles().find((record) => record.id === user.id) ?? {
      id: user.id,
      firstName: "",
      lastName: "",
      course: "",
      institute: "",
      email: normalizeEmail(user.email),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const next = upsertProfile({
      ...existing,
      ...profile,
      email: normalizeEmail(user.email)
    });
    setUser(toAuthUser(next));
  };
  const resetPassword = async (email) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${getBaseUrl()}/login`
    });
    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not send reset email."));
    }
  };
  const completePasswordReset = async (newPassword) => {
    if (newPassword.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not update password."));
    }
  };
  const updatePassword = async (newPassword) => {
    if (!user) {
      throw new Error("You must be signed in to change password.");
    }
    await completePasswordReset(newPassword);
  };
  const changeEmail = async (newEmail) => {
    if (!user) {
      throw new Error("You must be signed in to change email.");
    }
    const normalizedEmail = normalizeEmail(newEmail);
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    if (normalizedEmail === normalizeEmail(user.email)) {
      throw new Error("New email is the same as your current email.");
    }
    const { error } = await supabase.auth.updateUser(
      { email: normalizedEmail },
      { emailRedirectTo: `${getBaseUrl()}/profile` }
    );
    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not start email update."));
    }
    upsertProfile({
      ...readProfiles().find((record) => record.id === user.id) ?? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        course: user.course,
        institute: user.institute,
        email: normalizeEmail(user.email),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      email: normalizeEmail(user.email)
    });
  };
  const grantAdminAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to grant admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can assign admin access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (readOwnerEmails().includes(normalized)) {
      throw new Error("Owner already has full access.");
    }
    ensureRegisteredEmail(normalized);
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      return;
    }
    const admins = readAdminEmails();
    if (admins.includes(normalized)) {
      return;
    }
    if (admins.length >= MAX_ADMINS) {
      throw new Error(`A maximum of ${MAX_ADMINS} admins is allowed.`);
    }
    writeAdminEmails([...admins, normalized]);
  };
  const grantOwnerAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to grant owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can assign owner access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    ensureRegisteredEmail(normalized);
    const owners = readOwnerEmails();
    if (owners.includes(normalized)) {
      return;
    }
    writeOwnerEmails([...owners, normalized]);
  };
  const revokeOwnerAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to revoke owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can revoke owner access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    const owners = readOwnerEmails();
    if (!owners.includes(normalized)) {
      return;
    }
    if (owners.length <= 1) {
      throw new Error("At least one owner must remain.");
    }
    writeOwnerEmails(owners.filter((ownerEmail) => ownerEmail !== normalized));
  };
  const revokeAdminAccess = async (email) => {
    if (!user) {
      throw new Error("You must be signed in as owner to revoke admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can revoke admin access.");
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      throw new Error("Reserved admin access cannot be revoked.");
    }
    const admins = readAdminEmails();
    if (!admins.includes(normalized)) {
      return;
    }
    writeAdminEmails(admins.filter((adminEmail) => adminEmail !== normalized));
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const role = getUserRole(user?.email);
  const isOwner = role === "owner";
  const isAdmin = role === "owner" || role === "admin";
  const ownerEmails = readOwnerEmails();
  const managedAdminEmails = readAdminEmails();
  const adminEmails = [SYSTEM_ADMIN_EMAIL, ...managedAdminEmails];
  const isProfileComplete = hasCompleteProfile(user);
  const value = reactExports.useMemo(
    () => ({
      user,
      loading,
      role,
      isOwner,
      isAdmin,
      ownerEmails,
      adminEmails,
      managedAdminEmails,
      isProfileComplete,
      signInWithPassword,
      register,
      updateProfile,
      resetPassword,
      completePasswordReset,
      updatePassword,
      changeEmail,
      grantOwnerAccess,
      revokeOwnerAccess,
      grantAdminAccess,
      revokeAdminAccess,
      signOut
    }),
    [
      user,
      loading,
      role,
      isOwner,
      isAdmin,
      ownerEmails,
      adminEmails,
      managedAdminEmails,
      isProfileComplete
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useAuth() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$a = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lexora" },
      {
        name: "description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lexora" },
      {
        property: "og:description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lexora" },
      {
        name: "twitter:description",
        content: "Lexora Community Hub is a website showcasing community information, activities, and internship opportunities."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4437d8a8-216a-40ae-9242-0573dd66d662/id-preview-6cb511a4--1a1c3341-982f-4acc-80b6-976b486d4ed3.lovable.app-1777140693817.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4437d8a8-216a-40ae-9242-0573dd66d662/id-preview-6cb511a4--1a1c3341-982f-4acc-80b6-976b486d4ed3.lovable.app-1777140693817.png"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$9 = () => import("./profile-CFTxRlro.mjs");
const Route$9 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "My Profile — Lexora Community"
    }, {
      name: "description",
      content: "Your Lexora profile and history of applied internships."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./members-DBNlzI5O.mjs");
const Route$8 = createFileRoute("/members")({
  head: () => ({
    meta: [{
      title: "Members — Lexora Community"
    }, {
      name: "description",
      content: "Meet the founding and core members behind Lexora Community."
    }, {
      property: "og:title",
      content: "Lexora Members"
    }, {
      property: "og:description",
      content: "The founding and core team driving Lexora's mission forward."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./magazines-DbukmGPX.mjs");
const Route$7 = createFileRoute("/magazines")({
  head: () => ({
    meta: [{
      title: "Internship Magazines — Lexora Community"
    }, {
      name: "description",
      content: "Curated internship opportunities posted by Lexora. Sign in to apply and track your applications."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./login-Bx-jmA6F.mjs");
const Route$6 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In — Lexora Community"
    }, {
      name: "description",
      content: "Sign in to Lexora with email/password, create an account, and recover your password."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./internships-C-HSwo8g.mjs");
const Route$5 = createFileRoute("/internships")({
  head: () => ({
    meta: [{
      title: "Internships — Lexora Community"
    }, {
      name: "description",
      content: "Explore internship opportunities, apply with one click, and track your application status."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-DN4MAxXM.mjs");
const Route$4 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — Lexora Community"
    }, {
      name: "description",
      content: "Get in touch with Lexora Community via email, phone, LinkedIn or Instagram."
    }, {
      property: "og:title",
      content: "Contact Lexora Community"
    }, {
      property: "og:description",
      content: "Reach the Lexora team — we'd love to hear from you."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin-DiwkjUsT.mjs");
const Route$3 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard - Lexora Community"
    }, {
      name: "description",
      content: "Admin controls for users, permissions, website content, and activity insights."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./activities-D5xSMvAe.mjs");
const Route$2 = createFileRoute("/activities")({
  head: () => ({
    meta: [{
      title: "Activities — Lexora Community"
    }, {
      name: "description",
      content: "Debates, blog writing, seminars, conferences, webinars, internships and monthly magazines at Lexora."
    }, {
      property: "og:title",
      content: "Lexora Activities"
    }, {
      property: "og:description",
      content: "A wide range of academic and professional activities organised year-round."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-Bev8dp7q.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Lexora Community"
    }, {
      name: "description",
      content: "Learn about Lexora's mission to spread knowledge through collective contribution across law, management and allied domains."
    }, {
      property: "og:title",
      content: "About Lexora Community"
    }, {
      property: "og:description",
      content: "A multidisciplinary student community founded to maximise the spread of knowledge."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CeTISfKs.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Lexora Community — Knowledge that Liberates"
    }, {
      name: "description",
      content: "Lexora is a multidisciplinary student community for law, management, and allied domains. Sa Vidyā Ya Vimuktaye."
    }, {
      property: "og:title",
      content: "Lexora Community"
    }, {
      property: "og:description",
      content: "Knowledge that liberates. Join a multidisciplinary ecosystem of debates, blogs, conferences and internships."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ProfileRoute = Route$9.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$a
});
const MembersRoute = Route$8.update({
  id: "/members",
  path: "/members",
  getParentRoute: () => Route$a
});
const MagazinesRoute = Route$7.update({
  id: "/magazines",
  path: "/magazines",
  getParentRoute: () => Route$a
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$a
});
const InternshipsRoute = Route$5.update({
  id: "/internships",
  path: "/internships",
  getParentRoute: () => Route$a
});
const ContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$a
});
const AdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$a
});
const ActivitiesRoute = Route$2.update({
  id: "/activities",
  path: "/activities",
  getParentRoute: () => Route$a
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$a
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ActivitiesRoute,
  AdminRoute,
  ContactRoute,
  InternshipsRoute,
  LoginRoute,
  MagazinesRoute,
  MembersRoute,
  ProfileRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({
  error,
  reset
}) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AUTH_CHANGED_EVENT as A,
  MAX_ADMINS as M,
  SYSTEM_ADMIN_EMAIL as S,
  getAllUsersForAdmin as a,
  AUTH_ACCOUNTS_KEY as b,
  AUTH_ADMIN_EMAILS_KEY as c,
  getUserRole as g,
  router as r,
  supabase as s,
  useAuth as u
};

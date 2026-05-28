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
import "../_libs/@supabase/functions-js.mjs";
const appCss = "/assets/styles-DOzybVXe.css";
function createSupabaseClient() {
  const SUPABASE_URL = "https://hkwgsluxyzxxjwqfqqoo.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Hd_Xi8BAgM7p-Yx9qcPDNw_WMnd9p5-";
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
const AUTH_SESSION_KEY = "lexora.auth.session";
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
function normalizeSecurityAnswer(value) {
  return value.trim().toLowerCase();
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}
function isGmailEmail(value) {
  return normalizeEmail(value).endsWith("@gmail.com");
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
function hasCompleteProfile(user) {
  if (!user) return false;
  return [user.firstName, user.lastName, user.course, user.institute, user.email].every(
    (value) => value.trim().length > 0
  );
}
function normalizeProfileRow(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    course: row.course,
    institute: row.institute,
    email: normalizeEmail(row.email),
    password: row.password,
    securityQuestion: row.security_question ?? "",
    securityAnswer: row.security_answer ?? "",
    createdAt: row.created_at
  };
}
let accountsCache = [];
let ownerEmailsCache = [DEFAULT_OWNER_EMAIL];
let adminEmailsCache = [];
let hydratePromise = null;
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
function sanitizeAdminEmails(raw, owners) {
  const ownerSet = new Set(owners);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of raw) {
    const email = normalizeEmail(value);
    if (!email || ownerSet.has(email) || email === SYSTEM_ADMIN_EMAIL || seen.has(email)) continue;
    seen.add(email);
    normalized.push(email);
    if (normalized.length >= MAX_ADMINS) break;
  }
  return normalized;
}
function seedFromLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    const legacyAccountsRaw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    const legacyAccounts = legacyAccountsRaw ? JSON.parse(legacyAccountsRaw) : [];
    const normalizedAccounts = legacyAccounts.map((item) => ({
      id: String(item.id ?? "").trim() || makeId(),
      firstName: String(item.firstName ?? "").trim(),
      lastName: String(item.lastName ?? "").trim(),
      course: String(item.course ?? "").trim(),
      institute: String(item.institute ?? "").trim(),
      email: normalizeEmail(String(item.email ?? "")),
      password: String(item.password ?? ""),
      securityQuestion: String(item.securityQuestion ?? "").trim(),
      securityAnswer: normalizeSecurityAnswer(String(item.securityAnswer ?? "")),
      createdAt: String(item.createdAt ?? "").trim() || (/* @__PURE__ */ new Date()).toISOString()
    })).filter((item) => item.email.length > 0);
    const legacyOwners = sanitizeOwnerEmails(
      localStorage.getItem(AUTH_OWNER_EMAILS_KEY) ? JSON.parse(localStorage.getItem(AUTH_OWNER_EMAILS_KEY) ?? "[]") : [DEFAULT_OWNER_EMAIL]
    );
    const legacyAdmins = sanitizeAdminEmails(
      localStorage.getItem(AUTH_ADMIN_EMAILS_KEY) ? JSON.parse(localStorage.getItem(AUTH_ADMIN_EMAILS_KEY) ?? "[]") : [],
      legacyOwners
    );
    if (normalizedAccounts.length > 0) {
      void supabase.from("user_profiles").upsert(
        normalizedAccounts.map((account) => ({
          id: account.id,
          first_name: account.firstName,
          last_name: account.lastName,
          course: account.course,
          institute: account.institute,
          email: account.email,
          password: account.password,
          security_question: account.securityQuestion,
          security_answer: account.securityAnswer,
          created_at: account.createdAt
        }))
      );
    }
    const roleRows = [
      ...legacyOwners.map((email) => ({ email, role: "owner" })),
      ...legacyAdmins.map((email) => ({ email, role: "admin" }))
    ];
    if (roleRows.length > 0) {
      void supabase.from("user_roles").upsert(roleRows);
    }
  } catch {
  }
}
async function hydrateAuthData() {
  if (typeof window === "undefined") {
    return;
  }
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    seedFromLocalStorage();
    const [profilesResult, rolesResult] = await Promise.all([
      supabase.from("user_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*")
    ]);
    if (!profilesResult.error) {
      accountsCache = (profilesResult.data ?? []).map((row) => normalizeProfileRow(row));
    }
    if (!rolesResult.error) {
      const ownerEmails = [DEFAULT_OWNER_EMAIL];
      const adminEmails = [];
      for (const row of rolesResult.data ?? []) {
        const email = normalizeEmail(String(row.email ?? ""));
        const role = String(row.role ?? "");
        if (!email) continue;
        if (role === "owner") ownerEmails.push(email);
        if (role === "admin") adminEmails.push(email);
      }
      ownerEmailsCache = sanitizeOwnerEmails(ownerEmails);
      adminEmailsCache = sanitizeAdminEmails(adminEmails, ownerEmailsCache);
    }
    dispatchAuthChanged();
  })();
  return hydratePromise;
}
const authChannel = typeof window === "undefined" ? null : supabase.channel("public:auth_state").on("postgres_changes", { event: "*", schema: "public", table: "user_profiles" }, () => {
  hydratePromise = null;
  void hydrateAuthData();
}).on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => {
  hydratePromise = null;
  void hydrateAuthData();
});
if (authChannel) {
  void authChannel.subscribe();
}
function findAccountByEmail(email) {
  const normalized = normalizeEmail(email);
  return accountsCache.find((account) => account.email === normalized) ?? null;
}
function requireCurrentAccount(user) {
  if (!user) {
    throw new Error("You must be signed in to continue.");
  }
  const account = accountsCache.find((item) => item.id === user.id) ?? null;
  if (!account) {
    throw new Error("Could not find your account.");
  }
  return account;
}
function ensureRegisteredEmail(email) {
  const normalized = normalizeEmail(email);
  const exists = accountsCache.some((account) => account.email === normalized);
  if (!exists) {
    throw new Error("Only registered users can be granted elevated access.");
  }
}
function getSessionId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_SESSION_KEY);
}
function setSession(accountId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_SESSION_KEY, accountId);
  dispatchAuthChanged();
}
function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  dispatchAuthChanged();
}
async function upsertProfile(record) {
  const payload = {
    id: record.id,
    first_name: record.firstName,
    last_name: record.lastName,
    course: record.course,
    institute: record.institute,
    email: record.email,
    password: record.password,
    security_question: record.securityQuestion,
    security_answer: record.securityAnswer,
    created_at: record.createdAt
  };
  const { error } = await supabase.from("user_profiles").upsert(payload);
  if (error) throw error;
  await hydrateAuthData();
  return record;
}
async function updateAccountById(accountId, updater) {
  const current = accountsCache.find((account) => account.id === accountId);
  if (!current) {
    throw new Error("Could not find your account.");
  }
  const next = updater(current);
  await upsertProfile(next);
  return next;
}
function getOwnerEmails() {
  return ownerEmailsCache;
}
function getAdminEmails() {
  return [SYSTEM_ADMIN_EMAIL, ...adminEmailsCache];
}
function getManagedAdminEmails() {
  return adminEmailsCache;
}
function getUserRole(email) {
  const normalizedEmail = normalizeEmail(email ?? "");
  if (!normalizedEmail) return "user";
  if (ownerEmailsCache.includes(normalizedEmail)) return "owner";
  if (normalizedEmail === SYSTEM_ADMIN_EMAIL) return "admin";
  if (adminEmailsCache.includes(normalizedEmail)) return "admin";
  return "user";
}
function getAllUsersForAdmin() {
  return accountsCache.map(toAdminRecord).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      await hydrateAuthData();
      if (!mounted) return;
      const sessionId = getSessionId();
      if (!sessionId) {
        setUser(null);
        setLoading(false);
        return;
      }
      const account = accountsCache.find((item) => item.id === sessionId) ?? null;
      if (!account) {
        clearSession();
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(toAuthUser(account));
      setLoading(false);
    };
    void hydrate();
    const onStorage = (event) => {
      if (event.key === null || event.key === AUTH_SESSION_KEY) {
        void hydrate();
      }
      if (event.key === null || event.key === AUTH_ACCOUNTS_KEY || event.key === AUTH_ADMIN_EMAILS_KEY || event.key === AUTH_OWNER_EMAILS_KEY) {
        void hydrateAuthData();
      }
    };
    const onAuthChanged = () => {
      void hydrate();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    };
  }, []);
  const signInWithPassword = async (email, password) => {
    await hydrateAuthData();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
      throw new Error("Email and password are required.");
    }
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const account = findAccountByEmail(normalizedEmail);
    if (!account) {
      throw new Error("No account found for this email.");
    }
    if (account.password !== password) {
      throw new Error("Incorrect email or password.");
    }
    setSession(account.id);
    setUser(toAuthUser(account));
  };
  const register = async (input) => {
    await hydrateAuthData();
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const course = input.course.trim();
    const institute = input.institute.trim();
    const email = normalizeEmail(input.email);
    const password = input.password;
    if (!firstName || !lastName || !course || !institute || !email || !password) {
      throw new Error("Please fill all fields.");
    }
    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!isGmailEmail(email)) {
      throw new Error('Email must end with "@gmail.com".');
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const accounts = accountsCache;
    if (accounts.some((account) => account.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const profileSeed = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      password,
      securityQuestion: "",
      securityAnswer: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await upsertProfile(profileSeed);
    setSession(profileSeed.id);
    setUser(toAuthUser(profileSeed));
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
    const next = await updateAccountById(requireCurrentAccount(user).id, (current) => ({
      ...current,
      ...profile,
      email: normalizeEmail(user.email)
    }));
    setUser(toAuthUser(next));
  };
  const requestPasswordReset = async (email) => {
    await hydrateAuthData();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const account = findAccountByEmail(normalizedEmail);
    if (!account) {
      throw new Error("No account found for this email.");
    }
    if (!account.securityQuestion || !account.securityAnswer) {
      throw new Error("This account has no security question set yet.");
    }
    return account.securityQuestion;
  };
  const completePasswordReset = async (email, securityAnswer, newPassword) => {
    await hydrateAuthData();
    const normalizedEmail = normalizeEmail(email);
    const password = newPassword.trim();
    const normalizedAnswer = normalizeSecurityAnswer(securityAnswer);
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }
    if (!isValidEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!normalizedAnswer) {
      throw new Error("Security answer is required.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const account = findAccountByEmail(normalizedEmail);
    if (!account) {
      throw new Error("No account found for this email.");
    }
    if (!account.securityQuestion || !account.securityAnswer) {
      throw new Error("This account has no security question set yet.");
    }
    if (account.securityAnswer !== normalizedAnswer) {
      throw new Error("Incorrect security answer.");
    }
    await updateAccountById(account.id, (current) => ({
      ...current,
      password
    }));
  };
  const updatePassword = async (currentPassword, newPassword) => {
    await hydrateAuthData();
    const activeUser = requireCurrentAccount(user);
    const password = newPassword.trim();
    if (!currentPassword) {
      throw new Error("Current password is required.");
    }
    if (activeUser.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const next = await updateAccountById(activeUser.id, (current) => ({
      ...current,
      password
    }));
    setUser(toAuthUser(next));
  };
  const changeEmail = async (currentPassword, newEmail) => {
    await hydrateAuthData();
    const activeUser = requireCurrentAccount(user);
    const normalizedEmail = normalizeEmail(newEmail);
    if (!currentPassword) {
      throw new Error("Current password is required.");
    }
    if (activeUser.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    if (!isGmailEmail(normalizedEmail)) {
      throw new Error('Email must end with "@gmail.com".');
    }
    if (normalizedEmail === normalizeEmail(activeUser.email)) {
      throw new Error("New email is the same as your current email.");
    }
    if (accountsCache.some((record) => record.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const { error } = await supabase.rpc("change_user_email", {
      actor_email: activeUser.email,
      actor_password: currentPassword,
      new_email: normalizedEmail
    });
    if (error) throw error;
    await hydrateAuthData();
    const refreshed = accountsCache.find((record) => record.email === normalizedEmail) ?? null;
    if (refreshed) {
      setUser(toAuthUser(refreshed));
    }
  };
  const updateSecurityQuestion = async (question, answer) => {
    await hydrateAuthData();
    const activeUser = requireCurrentAccount(user);
    const securityQuestion = question.trim();
    const securityAnswer = normalizeSecurityAnswer(answer);
    if (!securityQuestion) {
      throw new Error("Security question is required.");
    }
    if (!securityAnswer) {
      throw new Error("Security answer is required.");
    }
    const next = await updateAccountById(activeUser.id, (current) => ({
      ...current,
      securityQuestion,
      securityAnswer
    }));
    setUser(toAuthUser(next));
  };
  const grantAdminAccess = async (email) => {
    await hydrateAuthData();
    if (!user) {
      throw new Error("You must be signed in as owner to grant admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can assign admin access.");
    }
    const actorAccount = requireCurrentAccount(user);
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (ownerEmailsCache.includes(normalized)) {
      throw new Error("Owner already has full access.");
    }
    ensureRegisteredEmail(normalized);
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      return;
    }
    const admins = adminEmailsCache;
    if (admins.includes(normalized)) {
      return;
    }
    if (admins.length >= MAX_ADMINS) {
      throw new Error(`A maximum of ${MAX_ADMINS} admins is allowed.`);
    }
    const { error } = await supabase.rpc("grant_admin_access", {
      actor_email: actorAccount.email,
      actor_password: actorAccount.password,
      target_email: normalized
    });
    if (error) throw error;
    await hydrateAuthData();
  };
  const grantOwnerAccess = async (email) => {
    await hydrateAuthData();
    if (!user) {
      throw new Error("You must be signed in as owner to grant owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can assign owner access.");
    }
    const actorAccount = requireCurrentAccount(user);
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    ensureRegisteredEmail(normalized);
    if (ownerEmailsCache.includes(normalized)) {
      return;
    }
    const { error } = await supabase.rpc("grant_owner_access", {
      actor_email: actorAccount.email,
      actor_password: actorAccount.password,
      target_email: normalized
    });
    if (error) throw error;
    await hydrateAuthData();
  };
  const revokeOwnerAccess = async (email) => {
    await hydrateAuthData();
    if (!user) {
      throw new Error("You must be signed in as owner to revoke owner access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only an owner can revoke owner access.");
    }
    const actorAccount = requireCurrentAccount(user);
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    const owners = ownerEmailsCache;
    if (!owners.includes(normalized)) {
      return;
    }
    if (owners.length <= 1) {
      throw new Error("At least one owner must remain.");
    }
    const { error } = await supabase.rpc("revoke_owner_access", {
      actor_email: actorAccount.email,
      actor_password: actorAccount.password,
      target_email: normalized
    });
    if (error) throw error;
    await hydrateAuthData();
  };
  const revokeAdminAccess = async (email) => {
    await hydrateAuthData();
    if (!user) {
      throw new Error("You must be signed in as owner to revoke admin access.");
    }
    if (getUserRole(user.email) !== "owner") {
      throw new Error("Only the owner can revoke admin access.");
    }
    const actorAccount = requireCurrentAccount(user);
    const normalized = normalizeEmail(email);
    if (!normalized) {
      throw new Error("Please provide a valid email address.");
    }
    if (normalized === SYSTEM_ADMIN_EMAIL) {
      throw new Error("Reserved admin access cannot be revoked.");
    }
    const admins = adminEmailsCache;
    if (!admins.includes(normalized)) {
      return;
    }
    const { error } = await supabase.rpc("revoke_admin_access", {
      actor_email: actorAccount.email,
      actor_password: actorAccount.password,
      target_email: normalized
    });
    if (error) throw error;
    await hydrateAuthData();
  };
  const signOut = async () => {
    clearSession();
    setUser(null);
  };
  const role = getUserRole(user?.email);
  const isOwner = role === "owner";
  const isAdmin = role === "owner" || role === "admin";
  const ownerEmails = getOwnerEmails();
  const managedAdminEmails = getManagedAdminEmails();
  const adminEmails = getAdminEmails();
  const isProfileComplete = hasCompleteProfile(user);
  const value = {
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
    requestPasswordReset,
    completePasswordReset,
    updatePassword,
    changeEmail,
    updateSecurityQuestion,
    grantOwnerAccess,
    revokeOwnerAccess,
    grantAdminAccess,
    revokeAdminAccess,
    signOut
  };
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
const $$splitComponentImporter$9 = () => import("./profile-DD_f4_Wk.mjs");
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
const $$splitComponentImporter$8 = () => import("./members-CIinqxzT.mjs");
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
const $$splitComponentImporter$7 = () => import("./magazines-Cem0118q.mjs");
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
const $$splitComponentImporter$6 = () => import("./login-CqjDr-GK.mjs");
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
const $$splitComponentImporter$5 = () => import("./internships-B9VuzFg-.mjs");
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
const $$splitComponentImporter$4 = () => import("./contact-Br3Fa4Fn.mjs");
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
const $$splitComponentImporter$3 = () => import("./admin-BC2-xSIp.mjs");
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
const $$splitComponentImporter$2 = () => import("./activities-AUfWyfW_.mjs");
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
const $$splitComponentImporter$1 = () => import("./about-B0y91A7-.mjs");
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
const $$splitComponentImporter = () => import("./index-Bhqz_aIC.mjs");
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

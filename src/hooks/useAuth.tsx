import { supabase } from "@/integrations/supabase/client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const AUTH_ACCOUNTS_KEY = "lexora.auth.accounts";
export const AUTH_SESSION_KEY = "lexora.auth.session";
export const AUTH_ADMIN_EMAILS_KEY = "lexora.auth.admin-emails";
export const AUTH_OWNER_EMAILS_KEY = "lexora.auth.owner-emails";
export const AUTH_CHANGED_EVENT = "lexora:auth-changed";
export const DEFAULT_OWNER_EMAIL = "bsmanikanta2004@gmail.com";
export const OWNER_EMAIL = DEFAULT_OWNER_EMAIL;
export const SYSTEM_ADMIN_EMAIL = "lexora.community@gmail.com";
export const MAX_ADMINS = 2;

export type UserRole = "owner" | "admin" | "user";

interface LocalProfileRecord {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  email: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  createdAt: string;
}

export interface AdminAccountRecord {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  email: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  email: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  role: UserRole;
  isOwner: boolean;
  isAdmin: boolean;
  ownerEmails: string[];
  adminEmails: string[];
  managedAdminEmails: string[];
  isProfileComplete: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  completePasswordReset: (email: string, securityAnswer: string, newPassword: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  changeEmail: (currentPassword: string, newEmail: string) => Promise<void>;
  updateSecurityQuestion: (question: string, answer: string) => Promise<void>;
  grantOwnerAccess: (email: string) => Promise<void>;
  revokeOwnerAccess: (email: string) => Promise<void>;
  grantAdminAccess: (email: string) => Promise<void>;
  revokeAdminAccess: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

function normalizeEmail(email: string) {
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

function normalizeSecurityAnswer(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function isGmailEmail(value: string) {
  return normalizeEmail(value).endsWith("@gmail.com");
}

function toAdminRecord(account: LocalProfileRecord): AdminAccountRecord {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    course: account.course,
    institute: account.institute,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function toAuthUser(profile: LocalProfileRecord): AuthUser {
  return {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    course: profile.course,
    institute: profile.institute,
    email: profile.email,
  };
}

function hasCompleteProfile(user: AuthUser | null): boolean {
  if (!user) return false;
  return [user.firstName, user.lastName, user.course, user.institute, user.email].every(
    (value) => value.trim().length > 0,
  );
}

function normalizeProfileRow(row: {
  id: string;
  first_name: string;
  last_name: string;
  course: string;
  institute: string;
  email: string;
  password: string;
  security_question: string;
  security_answer: string;
  created_at: string;
}): LocalProfileRecord {
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
    createdAt: row.created_at,
  };
}

let accountsCache: LocalProfileRecord[] = [];
let ownerEmailsCache: string[] = [DEFAULT_OWNER_EMAIL];
let adminEmailsCache: string[] = [];
let hydratePromise: Promise<void> | null = null;

function sanitizeOwnerEmails(raw: string[]): string[] {
  const owners = [DEFAULT_OWNER_EMAIL, ...raw].map(normalizeEmail).filter(Boolean);
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const owner of owners) {
    if (seen.has(owner)) continue;
    seen.add(owner);
    normalized.push(owner);
  }
  return normalized;
}

function sanitizeAdminEmails(raw: string[], owners: string[]): string[] {
  const ownerSet = new Set(owners);
  const seen = new Set<string>();
  const normalized: string[] = [];
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
    const legacyAccounts = legacyAccountsRaw ? (JSON.parse(legacyAccountsRaw) as Array<Partial<LocalProfileRecord>>) : [];
    const normalizedAccounts = legacyAccounts
      .map((item) => ({
        id: String(item.id ?? "").trim() || makeId(),
        firstName: String(item.firstName ?? "").trim(),
        lastName: String(item.lastName ?? "").trim(),
        course: String(item.course ?? "").trim(),
        institute: String(item.institute ?? "").trim(),
        email: normalizeEmail(String(item.email ?? "")),
        password: String(item.password ?? ""),
        securityQuestion: String(item.securityQuestion ?? "").trim(),
        securityAnswer: normalizeSecurityAnswer(String(item.securityAnswer ?? "")),
        createdAt: String(item.createdAt ?? "").trim() || new Date().toISOString(),
      }))
      .filter((item) => item.email.length > 0);

    const legacyOwners = sanitizeOwnerEmails(
      (localStorage.getItem(AUTH_OWNER_EMAILS_KEY) ? JSON.parse(localStorage.getItem(AUTH_OWNER_EMAILS_KEY) ?? "[]") : [DEFAULT_OWNER_EMAIL]) as string[],
    );
    const legacyAdmins = sanitizeAdminEmails(
      (localStorage.getItem(AUTH_ADMIN_EMAILS_KEY) ? JSON.parse(localStorage.getItem(AUTH_ADMIN_EMAILS_KEY) ?? "[]") : []) as string[],
      legacyOwners,
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
          created_at: account.createdAt,
        })),
      );
    }

    const roleRows = [
      ...legacyOwners.map((email) => ({ email, role: "owner" as const })),
      ...legacyAdmins.map((email) => ({ email, role: "admin" as const })),
    ];

    if (roleRows.length > 0) {
      void supabase.from("user_roles").upsert(roleRows);
    }
  } catch {
    // ignore legacy migration issues
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
      supabase.from("user_roles").select("*") ,
    ]);

    if (!profilesResult.error) {
      accountsCache = (profilesResult.data ?? []).map((row) => normalizeProfileRow(row as any));
    }

    if (!rolesResult.error) {
      const ownerEmails = [DEFAULT_OWNER_EMAIL];
      const adminEmails: string[] = [];
      for (const row of rolesResult.data ?? []) {
        const email = normalizeEmail(String((row as any).email ?? ""));
        const role = String((row as any).role ?? "");
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

const authChannel =
  typeof window === "undefined"
    ? null
    : supabase
        .channel("public:auth_state")
        .on("postgres_changes", { event: "*", schema: "public", table: "user_profiles" }, () => {
          hydratePromise = null;
          void hydrateAuthData();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => {
          hydratePromise = null;
          void hydrateAuthData();
        });

if (authChannel) {
  void authChannel.subscribe();
}

function findAccountByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return accountsCache.find((account) => account.email === normalized) ?? null;
}

function requireCurrentAccount(user: AuthUser | null) {
  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

  const account = accountsCache.find((item) => item.id === user.id) ?? null;
  if (!account) {
    throw new Error("Could not find your account.");
  }

  return account;
}

function ensureRegisteredEmail(email: string) {
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

function setSession(accountId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_SESSION_KEY, accountId);
  dispatchAuthChanged();
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  dispatchAuthChanged();
}

async function upsertProfile(record: LocalProfileRecord): Promise<LocalProfileRecord> {
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
    created_at: record.createdAt,
  };

  const { error } = await supabase.from("user_profiles").upsert(payload);
  if (error) throw error;
  await hydrateAuthData();
  return record;
}

async function updateAccountById(
  accountId: string,
  updater: (account: LocalProfileRecord) => LocalProfileRecord,
) {
  const current = accountsCache.find((account) => account.id === accountId);
  if (!current) {
    throw new Error("Could not find your account.");
  }

  const next = updater(current);
  await upsertProfile(next);
  return next;
}

export function getOwnerEmails(): string[] {
  return ownerEmailsCache;
}

export function getAdminEmails(): string[] {
  return [SYSTEM_ADMIN_EMAIL, ...adminEmailsCache];
}

export function getManagedAdminEmails(): string[] {
  return adminEmailsCache;
}

export function getUserRole(email: string | null | undefined): UserRole {
  const normalizedEmail = normalizeEmail(email ?? "");
  if (!normalizedEmail) return "user";
  if (ownerEmailsCache.includes(normalizedEmail)) return "owner";
  if (normalizedEmail === SYSTEM_ADMIN_EMAIL) return "admin";
  if (adminEmailsCache.includes(normalizedEmail)) return "admin";
  return "user";
}

export function getAllUsersForAdmin(): AdminAccountRecord[] {
  return accountsCache
    .map(toAdminRecord)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const onStorage = (event: StorageEvent) => {
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

  const signInWithPassword = async (email: string, password: string) => {
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

  const register = async (input: RegisterInput) => {
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

    const profileSeed: LocalProfileRecord = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      password,
      securityQuestion: "",
      securityAnswer: "",
      createdAt: new Date().toISOString(),
    };

    await upsertProfile(profileSeed);
    setSession(profileSeed.id);
    setUser(toAuthUser(profileSeed));
  };

  const updateProfile = async (input: ProfileUpdateInput) => {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }

    const profile: ProfileUpdateInput = {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      course: input.course.trim(),
      institute: input.institute.trim(),
    };

    if (!profile.firstName || !profile.lastName || !profile.course || !profile.institute) {
      throw new Error("Please fill all profile fields.");
    }

    const next = await updateAccountById(requireCurrentAccount(user).id, (current) => ({
      ...current,
      ...profile,
      email: normalizeEmail(user.email),
    }));

    setUser(toAuthUser(next));
  };

  const requestPasswordReset = async (email: string) => {
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

  const completePasswordReset = async (email: string, securityAnswer: string, newPassword: string) => {
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
      password,
    }));
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
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
      password,
    }));

    setUser(toAuthUser(next));
  };

  const changeEmail = async (currentPassword: string, newEmail: string) => {
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
      new_email: normalizedEmail,
    });
    if (error) throw error;

    await hydrateAuthData();
    const refreshed = accountsCache.find((record) => record.email === normalizedEmail) ?? null;
    if (refreshed) {
      setUser(toAuthUser(refreshed));
    }
  };

  const updateSecurityQuestion = async (question: string, answer: string) => {
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
      securityAnswer,
    }));

    setUser(toAuthUser(next));
  };

  const grantAdminAccess = async (email: string) => {
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
      target_email: normalized,
    });
    if (error) throw error;
    await hydrateAuthData();
  };

  const grantOwnerAccess = async (email: string) => {
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
      target_email: normalized,
    });
    if (error) throw error;
    await hydrateAuthData();
  };

  const revokeOwnerAccess = async (email: string) => {
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
      target_email: normalized,
    });
    if (error) throw error;
    await hydrateAuthData();
  };

  const revokeAdminAccess = async (email: string) => {
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
      target_email: normalized,
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

  const value: AuthCtx = {
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
    signOut,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

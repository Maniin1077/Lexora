import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const AUTH_ACCOUNTS_KEY = "lexora.auth.accounts";
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
  signInWithPassword: (
    email: string,
    password: string,
    captchaToken?: string,
  ) => Promise<void>;
  register: (input: RegisterInput, captchaToken?: string) => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completePasswordReset: (newPassword: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
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

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
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

function readProfiles(): LocalProfileRecord[] {
  if (typeof window === "undefined") return [];

  const raw = safeParse<Array<Partial<LocalProfileRecord> & { password?: string }>>(
    localStorage.getItem(AUTH_ACCOUNTS_KEY),
    [],
  );

  const normalized = raw
    .map((item) => {
      const email = normalizeEmail(String(item.email ?? ""));
      const id = String(item.id ?? "").trim() || makeId();
      const createdAt = String(item.createdAt ?? "").trim() || new Date().toISOString();

      return {
        id,
        firstName: String(item.firstName ?? "").trim(),
        lastName: String(item.lastName ?? "").trim(),
        course: String(item.course ?? "").trim(),
        institute: String(item.institute ?? "").trim(),
        email,
        createdAt,
      } satisfies LocalProfileRecord;
    })
    .filter((item) => item.email.length > 0);

  return normalized;
}

function writeProfiles(profiles: LocalProfileRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(profiles));
  dispatchAuthChanged();
}

function sanitizeOwnerEmails(raw: string[]): string[] {
  const owners = [DEFAULT_OWNER_EMAIL, ...raw]
    .map(normalizeEmail)
    .filter(Boolean);

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const owner of owners) {
    if (seen.has(owner)) continue;
    seen.add(owner);
    normalized.push(owner);
  }

  return normalized;
}

function readOwnerEmails(): string[] {
  if (typeof window === "undefined") return [DEFAULT_OWNER_EMAIL];

  const raw = safeParse<string[]>(
    localStorage.getItem(AUTH_OWNER_EMAILS_KEY),
    [DEFAULT_OWNER_EMAIL],
  );
  const normalized = sanitizeOwnerEmails(raw);

  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function sanitizeAdminEmails(raw: string[], owners: string[]): string[] {
  const ownerSet = new Set(owners);
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const value of raw) {
    const email = normalizeEmail(value);
    if (
      !email ||
      ownerSet.has(email) ||
      email === SYSTEM_ADMIN_EMAIL ||
      seen.has(email)
    ) {
      continue;
    }

    seen.add(email);
    normalized.push(email);

    if (normalized.length >= MAX_ADMINS) break;
  }

  return normalized;
}

function readAdminEmails(): string[] {
  if (typeof window === "undefined") return [];

  const owners = readOwnerEmails();
  const raw = safeParse<string[]>(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    [],
  );
  const normalized = sanitizeAdminEmails(raw, owners);

  if (normalized.length !== raw.length) {
    localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function writeAdminEmails(emails: string[]) {
  if (typeof window === "undefined") return;
  const normalized = sanitizeAdminEmails(emails, readOwnerEmails());
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(normalized));
  dispatchAuthChanged();
}

function writeOwnerEmails(emails: string[]) {
  if (typeof window === "undefined") return;

  const owners = sanitizeOwnerEmails(emails);
  localStorage.setItem(AUTH_OWNER_EMAILS_KEY, JSON.stringify(owners));

  const admins = safeParse<string[]>(
    localStorage.getItem(AUTH_ADMIN_EMAILS_KEY),
    [],
  );
  const sanitizedAdmins = sanitizeAdminEmails(admins, owners);
  localStorage.setItem(AUTH_ADMIN_EMAILS_KEY, JSON.stringify(sanitizedAdmins));

  dispatchAuthChanged();
}

export function getOwnerEmails(): string[] {
  return readOwnerEmails();
}

export function getAdminEmails(): string[] {
  return [SYSTEM_ADMIN_EMAIL, ...readAdminEmails()];
}

export function getManagedAdminEmails(): string[] {
  return readAdminEmails();
}

export function getUserRole(email: string | null | undefined): UserRole {
  const normalizedEmail = normalizeEmail(email ?? "");
  if (!normalizedEmail) return "user";

  const owners = readOwnerEmails();
  if (owners.includes(normalizedEmail)) return "owner";
  if (normalizedEmail === SYSTEM_ADMIN_EMAIL) return "admin";

  const admins = readAdminEmails();
  if (admins.includes(normalizedEmail)) return "admin";

  return "user";
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

export function getAllUsersForAdmin(): AdminAccountRecord[] {
  return readProfiles()
    .map(toAdminRecord)
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

function hasCompleteProfile(user: AuthUser | null): boolean {
  if (!user) return false;
  return [
    user.firstName,
    user.lastName,
    user.course,
    user.institute,
    user.email,
  ].every((value) => value.trim().length > 0);
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

function inferAuthErrorMessage(error: unknown, fallback: string): string {
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
  if (message.includes("failed to fetch") || message.includes("network") || message.includes("fetch")) {
    return "Network error: unable to reach authentication server. Check your internet connection and SUPABASE_URL.";
  }
  if (message.includes("password") && message.includes("6")) {
    return "Password must be at least 6 characters.";
  }

  return raw || fallback;
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  const fromEnv = import.meta.env.VITE_SITE_URL;
  return typeof fromEnv === "string" ? fromEnv : "";
}

function mergeProfileFromUser(existing: LocalProfileRecord | null, authUser: User): LocalProfileRecord {
  const normalizedEmail = normalizeEmail(authUser.email ?? "");

  return {
    id: existing?.id ?? authUser.id,
    firstName: existing?.firstName ?? "",
    lastName: existing?.lastName ?? "",
    course: existing?.course ?? "",
    institute: existing?.institute ?? "",
    email: normalizedEmail,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}

function upsertProfile(record: LocalProfileRecord): LocalProfileRecord {
  const profiles = readProfiles();
  const idx = profiles.findIndex(
    (item) => item.id === record.id || item.email === record.email,
  );

  if (idx === -1) {
    writeProfiles([record, ...profiles]);
    return record;
  }

  const merged: LocalProfileRecord = {
    ...profiles[idx],
    ...record,
    id: profiles[idx].id || record.id,
    createdAt: profiles[idx].createdAt || record.createdAt,
  };

  const next = [...profiles];
  next[idx] = merged;
  writeProfiles(next);
  return merged;
}

function ensureRegisteredEmail(email: string) {
  const normalized = normalizeEmail(email);
  const exists = readProfiles().some((account) => account.email === normalized);
  if (!exists) {
    throw new Error("Only registered users can be granted elevated access.");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrateFromSupabaseUser = async (supabaseUser: User | null) => {
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
      const existing =
        profiles.find((item) => item.id === supabaseUser.id) ??
        profiles.find((item) => item.email === normalizeEmail(supabaseUser.email ?? "")) ??
        null;

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
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrateFromSupabaseUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (
    email: string,
    password: string,
    captchaToken?: string,
  ) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      throw new Error("Email and password are required.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not sign in."));
    }

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error("Please verify your email before logging in.");
    }
  };

  const register = async (input: RegisterInput, captchaToken?: string) => {
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
    // captchaToken is optional when CAPTCHA is removed from the UI

    const profileSeed: LocalProfileRecord = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      createdAt: new Date().toISOString(),
    };
    upsertProfile(profileSeed);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getBaseUrl()}/login`,
      },
    });

    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not create account."));
    }

    await supabase.auth.signOut();
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

    const existing = readProfiles().find((record) => record.id === user.id) ?? {
      id: user.id,
      firstName: "",
      lastName: "",
      course: "",
      institute: "",
      email: normalizeEmail(user.email),
      createdAt: new Date().toISOString(),
    };

    const next = upsertProfile({
      ...existing,
      ...profile,
      email: normalizeEmail(user.email),
    });

    setUser(toAuthUser(next));
  };

  const resetPassword = async (email: string) => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${getBaseUrl()}/login`,
    });

    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not send reset email."));
    }
  };

  const completePasswordReset = async (newPassword: string) => {
    if (newPassword.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not update password."));
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) {
      throw new Error("You must be signed in to change password.");
    }

    await completePasswordReset(newPassword);
  };

  const changeEmail = async (newEmail: string) => {
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
      { emailRedirectTo: `${getBaseUrl()}/profile` },
    );

    if (error) {
      throw new Error(inferAuthErrorMessage(error, "Could not start email update."));
    }

    upsertProfile({
      ...(readProfiles().find((record) => record.id === user.id) ?? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        course: user.course,
        institute: user.institute,
        email: normalizeEmail(user.email),
        createdAt: new Date().toISOString(),
      }),
      email: normalizeEmail(user.email),
    });
  };

  const grantAdminAccess = async (email: string) => {
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

  const grantOwnerAccess = async (email: string) => {
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

  const revokeOwnerAccess = async (email: string) => {
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

  const revokeAdminAccess = async (email: string) => {
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

  const value = useMemo<AuthCtx>(
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
      signOut,
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
      isProfileComplete,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

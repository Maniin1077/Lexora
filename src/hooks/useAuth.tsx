import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

interface LocalAccountRecord {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  email: string;
  password: string;
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
  resetPassword: (email: string, newPassword: string) => Promise<void>;
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

function readAccounts(): LocalAccountRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<LocalAccountRecord[]>(
    localStorage.getItem(AUTH_ACCOUNTS_KEY),
    [],
  );
}

function writeAccounts(accounts: LocalAccountRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

function setSession(accountId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_SESSION_KEY, accountId);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
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
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
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

  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
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

function toAdminRecord(account: LocalAccountRecord): AdminAccountRecord {
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
  return readAccounts()
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

function toAuthUser(account: LocalAccountRecord): AuthUser {
  return {
    id: account.id,
    firstName: account.firstName,
    lastName: account.lastName,
    course: account.course,
    institute: account.institute,
    email: account.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = () => {
      if (typeof window === "undefined") return;

      const accounts = readAccounts();
      const sessionId = localStorage.getItem(AUTH_SESSION_KEY);

      if (sessionId) {
        const account = accounts.find((acc) => acc.id === sessionId) ?? null;
        if (account) {
          setUser(toAuthUser(account));
        } else {
          clearSession();
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    hydrate();

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === null ||
        e.key === AUTH_SESSION_KEY ||
        e.key === AUTH_ACCOUNTS_KEY ||
        e.key === AUTH_ADMIN_EMAILS_KEY ||
        e.key === AUTH_OWNER_EMAILS_KEY
      ) {
        hydrate();
      }
    };

    const onAuthChanged = () => hydrate();

    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    if (typeof window === "undefined") return;

    const normalizedEmail = normalizeEmail(email);
    const account = readAccounts().find((a) => a.email === normalizedEmail);

    if (!account) {
      throw new Error("No account found for this email.");
    }
    if (account.password !== password) {
      throw new Error("Incorrect password.");
    }

    setSession(account.id);
    setUser(toAuthUser(account));
  };

  const register = async (input: RegisterInput) => {
    if (typeof window === "undefined") return;

    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const course = input.course.trim();
    const institute = input.institute.trim();
    const email = normalizeEmail(input.email);
    const password = input.password;

    if (!firstName || !lastName || !course || !institute || !email || !password) {
      throw new Error("Please fill all fields.");
    }

    const accounts = readAccounts();
    if (accounts.some((acc) => acc.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const next: LocalAccountRecord = {
      id: makeId(),
      firstName,
      lastName,
      course,
      institute,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    writeAccounts([next, ...accounts]);
    setSession(next.id);
    setUser(toAuthUser(next));
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

    const accounts = readAccounts();
    const idx = accounts.findIndex((account) => account.id === user.id);
    if (idx === -1) {
      throw new Error("Could not find your account.");
    }

    const updatedAccount: LocalAccountRecord = {
      ...accounts[idx],
      firstName: profile.firstName,
      lastName: profile.lastName,
      course: profile.course,
      institute: profile.institute,
    };

    const nextAccounts = [...accounts];
    nextAccounts[idx] = updatedAccount;
    writeAccounts(nextAccounts);

    setUser(toAuthUser(updatedAccount));
  };

  const resetPassword = async (email: string, newPassword: string) => {
    if (typeof window === "undefined") return;

    const normalizedEmail = normalizeEmail(email);
    const password = newPassword;

    if (!normalizedEmail || !password) {
      throw new Error("Email and new password are required.");
    }

    const accounts = readAccounts();
    const idx = accounts.findIndex((acc) => acc.email === normalizedEmail);
    if (idx === -1) {
      throw new Error("No account found for this email.");
    }

    accounts[idx] = { ...accounts[idx], password };
    writeAccounts(accounts);
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

    const accounts = readAccounts();
    if (!accounts.some((account) => account.email === normalized)) {
      throw new Error("Only registered users can be granted admin access.");
    }

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

    const accounts = readAccounts();
    if (!accounts.some((account) => account.email === normalized)) {
      throw new Error("Only registered users can be granted owner access.");
    }

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
    if (typeof window === "undefined") return;
    clearSession();
    setUser(null);
  };

  const role = getUserRole(user?.email);
  const isOwner = role === "owner";
  const isAdmin = role === "owner" || role === "admin";
  const ownerEmails = readOwnerEmails();
  const managedAdminEmails = readAdminEmails();
  const adminEmails = [SYSTEM_ADMIN_EMAIL, ...managedAdminEmails];
  const isProfileComplete = hasCompleteProfile(user);

  return (
    <Ctx.Provider
      value={{
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
        grantOwnerAccess,
        revokeOwnerAccess,
        grantAdminAccess,
        revokeAdminAccess,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

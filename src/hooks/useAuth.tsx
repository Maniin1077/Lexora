import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
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
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  completePasswordReset: (
    email: string,
    securityAnswer: string,
    newPassword: string,
  ) => Promise<void>;
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

function normalizeSecurityAnswer(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function isGmailEmail(value: string) {
  return normalizeEmail(value).endsWith("@gmail.com");
}

function readAccounts(): LocalProfileRecord[] {
  if (typeof window === "undefined") return [];

  const raw = safeParse<Array<Partial<LocalProfileRecord>>>(
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
        password: String(item.password ?? ""),
        securityQuestion: String(item.securityQuestion ?? "").trim(),
        securityAnswer: normalizeSecurityAnswer(String(item.securityAnswer ?? "")),
        createdAt,
      } satisfies LocalProfileRecord;
    })
    .filter((item) => item.email.length > 0);

  const needsRewrite = normalized.length !== raw.length || raw.some((item, index) => {
    const next = normalized[index];
    return (
      !next ||
      item.email !== next.email ||
      item.password !== next.password ||
      item.securityQuestion !== next.securityQuestion ||
      item.securityAnswer !== next.securityAnswer ||
      item.createdAt !== next.createdAt ||
      item.firstName !== next.firstName ||
      item.lastName !== next.lastName ||
      item.course !== next.course ||
      item.institute !== next.institute
    );
  });

  if (needsRewrite) {
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function readProfiles(): LocalProfileRecord[] {
  return readAccounts();
}

function writeProfiles(profiles: LocalProfileRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(profiles));
  dispatchAuthChanged();
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

function replaceEmailInAccessLists(oldEmail: string, nextEmail: string) {
  const normalizedOld = normalizeEmail(oldEmail);
  const normalizedNext = normalizeEmail(nextEmail);

  const owners = readOwnerEmails();
  if (owners.includes(normalizedOld)) {
    writeOwnerEmails(
      owners.map((ownerEmail) =>
        ownerEmail === normalizedOld ? normalizedNext : ownerEmail,
      ),
    );
  }

  const admins = readAdminEmails();
  if (admins.includes(normalizedOld)) {
    writeAdminEmails(
      admins.map((adminEmail) =>
        adminEmail === normalizedOld ? normalizedNext : adminEmail,
      ),
    );
  }
}

function findAccountByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return readProfiles().find((account) => account.email === normalized) ?? null;
}

function updateAccountById(
  accountId: string,
  updater: (account: LocalProfileRecord) => LocalProfileRecord,
) {
  const profiles = readProfiles();
  const index = profiles.findIndex((account) => account.id === accountId);

  if (index === -1) {
    throw new Error("Could not find your account.");
  }

  const nextProfile = updater(profiles[index]);
  const nextProfiles = [...profiles];
  nextProfiles[index] = nextProfile;
  writeProfiles(nextProfiles);
  return nextProfile;
}

function requireCurrentAccount(user: AuthUser | null) {
  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

  const account = readProfiles().find((item) => item.id === user.id) ?? null;
  if (!account) {
    throw new Error("Could not find your account.");
  }

  return account;
}

function requireValidGmail(email: string) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    throw new Error("Email is required.");
  }
  if (!isValidEmail(normalized)) {
    throw new Error("Please enter a valid email address.");
  }
  if (!isGmailEmail(normalized)) {
    throw new Error('Email must end with "@gmail.com".');
  }

  return normalized;
}

function updateLocalAccessListsForEmailChange(oldEmail: string, nextEmail: string) {
  replaceEmailInAccessLists(oldEmail, nextEmail);
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

    const hydrate = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const accounts = readProfiles();
      const sessionId = localStorage.getItem(AUTH_SESSION_KEY);

      if (!sessionId) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const account = accounts.find((item) => item.id === sessionId) ?? null;
      if (!account) {
        clearSession();
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setUser(toAuthUser(account));
        setLoading(false);
      }
    };

    void hydrate();

    const onStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === AUTH_SESSION_KEY ||
        event.key === AUTH_ACCOUNTS_KEY ||
        event.key === AUTH_ADMIN_EMAILS_KEY ||
        event.key === AUTH_OWNER_EMAILS_KEY
      ) {
        void hydrate();
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

  const signInWithPassword = async (
    email: string,
    password: string,
  ) => {
    if (typeof window === "undefined") return;

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
    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (!isGmailEmail(email)) {
      throw new Error('Email must end with "@gmail.com".');
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const accounts = readProfiles();
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

    writeProfiles([profileSeed, ...accounts]);
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

    const next = upsertProfile({
      ...requireCurrentAccount(user),
      ...profile,
      email: normalizeEmail(user.email),
    });

    setUser(toAuthUser(next));
  };

  const requestPasswordReset = async (email: string) => {
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

  const completePasswordReset = async (
    email: string,
    securityAnswer: string,
    newPassword: string,
  ) => {
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

    updateAccountById(account.id, (current) => ({
      ...current,
      password,
    }));
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
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

    const next = updateAccountById(activeUser.id, (current) => ({
      ...current,
      password,
    }));

    setUser(toAuthUser(next));
  };

  const changeEmail = async (currentPassword: string, newEmail: string) => {
    const activeUser = requireCurrentAccount(user);
    const normalizedEmail = requireValidGmail(newEmail);

    if (!currentPassword) {
      throw new Error("Current password is required.");
    }
    if (activeUser.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    if (normalizedEmail === normalizeEmail(activeUser.email)) {
      throw new Error("New email is the same as your current email.");
    }
    if (readProfiles().some((record) => record.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const next = updateAccountById(activeUser.id, (current) => ({
      ...current,
      email: normalizedEmail,
    }));

    updateLocalAccessListsForEmailChange(activeUser.email, normalizedEmail);
    setUser(toAuthUser(next));
  };

  const updateSecurityQuestion = async (question: string, answer: string) => {
    const activeUser = requireCurrentAccount(user);
    const securityQuestion = question.trim();
    const securityAnswer = normalizeSecurityAnswer(answer);

    if (!securityQuestion) {
      throw new Error("Security question is required.");
    }
    if (!securityAnswer) {
      throw new Error("Security answer is required.");
    }

    const next = updateAccountById(activeUser.id, (current) => ({
      ...current,
      securityQuestion,
      securityAnswer,
    }));

    setUser(toAuthUser(next));
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

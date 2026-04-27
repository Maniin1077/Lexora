import { UserRole } from "@/hooks/useAuth";

export type ChangeActorRole = "owner" | "admin";

export type ChangeAction =
  | "member.add"
  | "member.update"
  | "member.remove"
  | "internship.add"
  | "internship.update"
  | "internship.remove"
  | "magazine.add"
  | "magazine.update"
  | "magazine.remove"
  | "site.page.update"
  | "site.page.reset"
  | "site.home.update"
  | "site.home.reset"
  | "owner.grant"
  | "owner.revoke"
  | "admin.grant"
  | "admin.revoke";

export interface ChangeLogEntry {
  id: string;
  actorEmail: string;
  actorRole: ChangeActorRole;
  action: ChangeAction;
  target: string;
  detail?: string;
  createdAt: string;
}

export interface LogChangeInput {
  actorEmail: string;
  actorRole: ChangeActorRole;
  action: ChangeAction;
  target: string;
  detail?: string;
}

export const CHANGE_LOG_KEY = "lexora.change-log";
export const CHANGE_LOG_CHANGED_EVENT = "lexora:change-log-changed";

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
    return `log-${crypto.randomUUID()}`;
  }
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function writeLogs(logs: ChangeLogEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHANGE_LOG_KEY, JSON.stringify(logs));
  window.dispatchEvent(new CustomEvent(CHANGE_LOG_CHANGED_EVENT));
}

export function getChangeLogs(): ChangeLogEntry[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<ChangeLogEntry[]>(
    localStorage.getItem(CHANGE_LOG_KEY),
    [],
  );

  return parsed.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function logChange(input: LogChangeInput): ChangeLogEntry {
  const entry: ChangeLogEntry = {
    id: makeId(),
    actorEmail: input.actorEmail.trim().toLowerCase(),
    actorRole: input.actorRole,
    action: input.action,
    target: input.target.trim(),
    detail: input.detail?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const current = getChangeLogs();
  const next = [entry, ...current].slice(0, 300);
  writeLogs(next);
  return entry;
}

export function getVisibleChangeLogsForRole(role: UserRole): ChangeLogEntry[] {
  const all = getChangeLogs();

  if (role === "owner") {
    // Owner can review all modifications.
    return all;
  }

  if (role === "admin") {
    // Admins can review admin modifications only, not owner edits.
    return all.filter((entry) => entry.actorRole === "admin");
  }

  return [];
}

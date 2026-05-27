import { UserRole } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `log-${crypto.randomUUID()}`;
  }
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function dispatchChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGE_LOG_CHANGED_EVENT));
}

function fromRow(row: {
  id: string;
  actor_email: string;
  actor_role: ChangeActorRole;
  action: ChangeAction;
  target: string;
  detail: string | null;
  created_at: string;
}): ChangeLogEntry {
  return {
    id: row.id,
    actorEmail: row.actor_email,
    actorRole: row.actor_role,
    action: row.action,
    target: row.target,
    detail: row.detail ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getChangeLogs(): Promise<ChangeLogEntry[]> {
  const { data, error } = await supabase
    .from("change_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getChangeLogs error", error);
    return [];
  }

  return (data ?? []).map((row) => fromRow(row as any));
}

export async function logChange(input: LogChangeInput): Promise<ChangeLogEntry> {
  const entry = {
    id: makeId(),
    actor_email: input.actorEmail.trim().toLowerCase(),
    actor_role: input.actorRole,
    action: input.action,
    target: input.target.trim(),
    detail: input.detail?.trim() || null,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("change_logs").insert(entry);
  if (error) throw error;
  dispatchChanged();
  return fromRow(entry);
}

export async function getVisibleChangeLogsForRole(role: UserRole): Promise<ChangeLogEntry[]> {
  const all = await getChangeLogs();

  if (role === "owner") {
    return all;
  }

  if (role === "admin") {
    return all.filter((entry) => entry.actorRole === "admin");
  }

  return [];
}

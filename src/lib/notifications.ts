import { supabase } from "@/integrations/supabase/client";

export const NOTIFICATIONS_KEY = "lexora.notifications";
export const NOTIFICATIONS_CHANGED_EVENT = "lexora:notifications-changed";

export interface NotificationRecord {
  id: string;
  targetEmail: string | null;
  title: string;
  message: string;
  senderEmail: string;
  createdAt: string;
  readBy: string[];
}

export interface CreateNotificationInput {
  targetEmail?: string | null;
  title: string;
  message: string;
  senderEmail: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function dispatchNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
}

function toRow(record: NotificationRecord) {
  return {
    id: record.id,
    target_email: record.targetEmail,
    title: record.title,
    message: record.message,
    sender_email: record.senderEmail,
    created_at: record.createdAt,
    read_by: record.readBy,
  };
}

function fromRow(row: {
  id: string;
  target_email: string | null;
  title: string;
  message: string;
  sender_email: string;
  created_at: string;
  read_by: string[] | null;
}): NotificationRecord {
  return {
    id: row.id,
    targetEmail: row.target_email,
    title: row.title,
    message: row.message,
    senderEmail: row.sender_email,
    createdAt: row.created_at,
    readBy: row.read_by ?? [],
  };
}

export async function createNotification(input: CreateNotificationInput) {
  const title = input.title.trim();
  const message = input.message.trim();
  const senderEmail = normalizeEmail(input.senderEmail);
  const targetEmail = input.targetEmail ? normalizeEmail(input.targetEmail) : null;

  if (!title || !message || !senderEmail) {
    throw new Error("Notification title, message, and sender are required.");
  }

  const payload = toRow({
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    targetEmail,
    title,
    message,
    senderEmail,
    createdAt: new Date().toISOString(),
    readBy: [],
  });

  const { error } = await supabase.from("notifications").insert(payload);
  if (error) throw error;
  dispatchNotificationsChanged();
}

export async function getNotificationsForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .or(`target_email.is.null,target_email.eq.${normalized}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getNotificationsForEmail error", error);
    return [];
  }

  return (data ?? []).map((row) => fromRow(row as any));
}

export async function getUnreadNotificationsForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];

  const all = await getNotificationsForEmail(normalized);
  return all.filter((item) => !item.readBy.includes(normalized));
}

export async function getUnreadNotificationCount(email: string | null | undefined) {
  return (await getUnreadNotificationsForEmail(email)).length;
}

export async function markNotificationsReadForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return;

  const unread = await getUnreadNotificationsForEmail(normalized);
  for (const item of unread) {
    const nextReadBy = Array.from(new Set([...item.readBy, normalized]));
    const { error } = await supabase
      .from("notifications")
      .update({ read_by: nextReadBy })
      .eq("id", item.id);
    if (error) throw error;
  }

  dispatchNotificationsChanged();
}

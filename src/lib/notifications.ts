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
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function dispatchNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
}

function readNotifications(): NotificationRecord[] {
  if (typeof window === "undefined") return [];

  const raw = safeParse<Array<Partial<NotificationRecord>>>(
    localStorage.getItem(NOTIFICATIONS_KEY),
    [],
  );

  const normalized = raw
    .map((item) => ({
      id: String(item.id ?? "").trim() || makeId(),
      targetEmail:
        item.targetEmail === null || item.targetEmail === undefined
          ? null
          : normalizeEmail(String(item.targetEmail)),
      title: String(item.title ?? "").trim(),
      message: String(item.message ?? "").trim(),
      senderEmail: normalizeEmail(String(item.senderEmail ?? "")),
      createdAt: String(item.createdAt ?? "").trim() || new Date().toISOString(),
      readBy: Array.isArray(item.readBy)
        ? item.readBy.map((email) => normalizeEmail(String(email))).filter(Boolean)
        : [],
    }))
    .filter((item) => item.title.length > 0 && item.message.length > 0);

  const needsRewrite = normalized.length !== raw.length || raw.some((item, index) => {
    const next = normalized[index];
    return (
      !next ||
      String(item.id ?? "") !== next.id ||
      String(item.title ?? "").trim() !== next.title ||
      String(item.message ?? "").trim() !== next.message ||
      String(item.senderEmail ?? "").trim().toLowerCase() !== next.senderEmail ||
      String(item.createdAt ?? "").trim() !== next.createdAt
    );
  });

  if (needsRewrite) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function writeNotifications(records: NotificationRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(records));
  dispatchNotificationsChanged();
}

function normalizeTargetEmail(targetEmail?: string | null) {
  if (targetEmail === null || targetEmail === undefined) return null;
  const normalized = normalizeEmail(targetEmail);
  return normalized.length > 0 ? normalized : null;
}

export function createNotification(input: CreateNotificationInput) {
  if (typeof window === "undefined") return;

  const title = input.title.trim();
  const message = input.message.trim();
  const senderEmail = normalizeEmail(input.senderEmail);
  const targetEmail = normalizeTargetEmail(input.targetEmail ?? null);

  if (!title || !message || !senderEmail) {
    throw new Error("Notification title, message, and sender are required.");
  }

  const next: NotificationRecord = {
    id: makeId(),
    targetEmail,
    title,
    message,
    senderEmail,
    createdAt: new Date().toISOString(),
    readBy: [],
  };

  writeNotifications([next, ...readNotifications()]);
}

export function getNotificationsForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];

  return readNotifications()
    .filter((item) => item.targetEmail === null || item.targetEmail === normalized)
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getUnreadNotificationsForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return [];

  return getNotificationsForEmail(normalized).filter(
    (item) => !item.readBy.includes(normalized),
  );
}

export function getUnreadNotificationCount(email: string | null | undefined) {
  return getUnreadNotificationsForEmail(email).length;
}

export function markNotificationsReadForEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email ?? "");
  if (!normalized) return;

  const records = readNotifications();
  let changed = false;

  const next = records.map((item) => {
    if (item.targetEmail !== null && item.targetEmail !== normalized) {
      return item;
    }

    if (item.readBy.includes(normalized)) {
      return item;
    }

    changed = true;
    return {
      ...item,
      readBy: [...item.readBy, normalized],
    };
  });

  if (changed) {
    writeNotifications(next);
  }
}

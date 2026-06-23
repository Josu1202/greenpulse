import { db } from "@/db/database";
import type {
  AppNotification,
  NotificationEntityType,
  NotificationType,
  User,
} from "@/types";

export interface NotificationActorInput {
  actorUserId?: string;
  actorName?: string;
  actorProfileImage?: string;
}

export interface CreateNotificationInput extends NotificationActorInput {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: string;
  actionUrl?: string;
}

export type CreateNotificationForAdminsInput = Omit<
  CreateNotificationInput,
  "recipientUserId"
>;

function shouldSkipSelfNotification(input: CreateNotificationInput): boolean {
  return Boolean(input.actorUserId && input.actorUserId === input.recipientUserId);
}

async function hasEquivalentNotification(input: CreateNotificationInput): Promise<boolean> {
  if (input.type !== "badge_earned" || !input.entityId) {
    return false;
  }

  const existingNotification = await db.notifications
    .where("recipientUserId")
    .equals(input.recipientUserId)
    .and(
      (notification) =>
        notification.type === input.type && notification.entityId === input.entityId
    )
    .first();

  return Boolean(existingNotification);
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<AppNotification | undefined> {
  if (shouldSkipSelfNotification(input)) {
    return undefined;
  }

  if (await hasEquivalentNotification(input)) {
    return undefined;
  }

  const notification: AppNotification = {
    id: crypto.randomUUID(),
    recipientUserId: input.recipientUserId,
    actorUserId: input.actorUserId,
    actorName: input.actorName,
    actorProfileImage: input.actorProfileImage,
    type: input.type,
    title: input.title,
    message: input.message,
    entityType: input.entityType,
    entityId: input.entityId,
    actionUrl: input.actionUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  await db.notifications.add(notification);

  return notification;
}

export async function createNotificationForAdmins(
  input: CreateNotificationForAdminsInput
): Promise<AppNotification[]> {
  const admins = await db.users
    .where("role")
    .equals("admin")
    .and((user: User) => user.isActive !== false && user.id !== input.actorUserId)
    .toArray();

  const createdNotifications: AppNotification[] = [];

  for (const admin of admins) {
    const notification = await createNotification({
      ...input,
      recipientUserId: admin.id,
    });

    if (notification) {
      createdNotifications.push(notification);
    }
  }

  return createdNotifications;
}

export async function getNotificationsByUser(
  userId: string
): Promise<AppNotification[]> {
  const notifications = await db.notifications
    .where("recipientUserId")
    .equals(userId)
    .sortBy("createdAt");

  return notifications.reverse();
}

export async function getUnreadNotificationsByUser(
  userId: string
): Promise<AppNotification[]> {
  const notifications = await getNotificationsByUser(userId);

  return notifications.filter((notification) => !notification.isRead);
}

export async function countUnreadNotificationsByUser(
  userId: string
): Promise<number> {
  return db.notifications
    .where("recipientUserId")
    .equals(userId)
    .and((notification) => notification.isRead === false)
    .count();
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await db.notifications.update(id, {
    isRead: true,
    readAt: new Date().toISOString(),
  } as Partial<AppNotification>);
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await db.notifications
    .where("recipientUserId")
    .equals(userId)
    .modify((notification) => {
      notification.isRead = true;
      notification.readAt = notification.readAt ?? new Date().toISOString();
    });
}

export async function deleteNotification(id: string): Promise<void> {
  await db.notifications.delete(id);
}

export async function clearNotificationsByUser(userId: string): Promise<void> {
  await db.notifications.where("recipientUserId").equals(userId).delete();
}

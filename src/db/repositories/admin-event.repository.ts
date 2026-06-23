import { db } from "@/db/database";
import type { AdminEvent, AdminEventEntityType, AdminEventType } from "@/types";

export interface TrackAdminEventInput {
  userId?: string;
  userName?: string;
  type: AdminEventType;
  path?: string;
  entityId?: string;
  entityType?: AdminEventEntityType;
  description?: string;
}

export async function trackAdminEvent(
  input: TrackAdminEventInput
): Promise<AdminEvent> {
  const event: AdminEvent = {
    id: crypto.randomUUID(),
    userId: input.userId,
    userName: input.userName,
    type: input.type,
    path: input.path,
    entityId: input.entityId,
    entityType: input.entityType,
    description: input.description,
    createdAt: new Date().toISOString(),
  };

  await db.adminEvents.add(event);

  return event;
}

export async function getAllAdminEvents(): Promise<AdminEvent[]> {
  return db.adminEvents.orderBy("createdAt").reverse().toArray();
}

export async function getRecentAdminEvents(limit = 20): Promise<AdminEvent[]> {
  return db.adminEvents.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function clearAdminEvents(): Promise<void> {
  await db.adminEvents.clear();
}

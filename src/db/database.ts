import Dexie, { type Table } from "dexie";

import type {
  AppSettings,
  Category,
  Report,
  StatusLog,
  User,
} from "@/types";

export class GreenPulseDatabase extends Dexie {
  users!: Table<User, string>;
  reports!: Table<Report, string>;
  categories!: Table<Category, string>;
  statusLogs!: Table<StatusLog, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("GreenPulseDB");

    this.version(1).stores({
      users: "id, email, role, createdAt",
      reports:
        "id, userId, categoryId, status, priority, createdAt, updatedAt",
      categories: "id, name",
      statusLogs: "id, reportId, changedAt",
      settings: "id, seedLoaded",
    });
  }
}

export const db = new GreenPulseDatabase();
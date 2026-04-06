
import path from "path";
import {
  Database,
  JsonAdapter, 
  type Table,
} from "../core/storage/db.js";
import type { Friend } from "./friend.model.js";

interface AppData extends Record<string, Table> {
  friends: Friend[];
}

export class AppDBManager {
  private db: Database<AppData>;
  private static sharedInstance: AppDBManager | undefined = undefined;

  private constructor() {
    const dbPath = path.resolve(process.cwd(),'data/data.json');// "data", "data.json");
//../../data/data.json if needed to be add in dist

    const adapter = new JsonAdapter<AppData>();

    this.db = new Database<AppData>(dbPath, adapter);
  }

  static getInstance(): AppDBManager {
    if (!this.sharedInstance) {
      this.sharedInstance = new AppDBManager();
    }
    return this.sharedInstance;
  }

  getDB() {
    return this.db;
  }

  save() {
    this.db.save();
  }
}

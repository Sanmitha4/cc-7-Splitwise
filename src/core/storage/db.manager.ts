import {
  Database,
  type Dataset,
  type Row,
  JsonAdapter,
} from '../core/storage/db.js';
import type { Friend } from './friend.model.js';

interface AppData extends Dataset {
  friends: Friend[];
}

export class AppDBManager {
  private constructor() {
    this.db = new Database<AppData, keyof AppData>(
      '../../data/data.json',
      JsonAdapter,
    );
  }
  private static sharedInstance: AppDBManager | undefined = undefined;
  private db: Database<AppData, keyof AppData>;

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

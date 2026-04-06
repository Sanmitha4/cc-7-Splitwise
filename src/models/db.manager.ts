// import {
//   Database,
//   type Dataset,
//   type Row,
//   JsonAdapter,
// } from "../core/storage/db.js";

// import type { Friend } from "./friend-model.js";
// //import type { Expense } from '../../models/expense-model.js'

// // interface AppData extends Dataset {
// //     friends: Friend[];
// //     expenses: Expense[]; // Add the expenses table
// // }
// interface AppData extends Dataset {
//   friends: Friend[];
// }

// export class AppDBManager {
//   private constructor() {
//     this.db = new Database<AppData, keyof AppData>(
//       "../../data/data.json",
//       JsonAdapter,
//     );
//   }
//   private static sharedInstance: AppDBManager | undefined = undefined;
//   private db: Database<AppData, keyof AppData>;

//   static getInstance(): AppDBManager {
//     if (!this.sharedInstance) {
//       this.sharedInstance = new AppDBManager();
//     }
//     return this.sharedInstance;
//   }

//   getDB() {
//     return this.db;
//   }
  
//   save() {
//     this.db.save();
//   }
// }

import path from 'path';
import {
  Database,
  type Dataset,
  type Row,
  JsonAdapter,
} from '../core/storage/db.js';
import type { Friend } from './friend-model.js';

interface AppData extends Dataset {
  friends: Friend[];
}

export class AppDBManager {
    private constructor() {
      const dbPath=path.resolve(process.cwd(),'data/data.json');
    this.db = new Database<AppData, keyof AppData>(dbPath,JsonAdapter);
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

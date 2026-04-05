import { Database, type Dataset } from './db.js';
import type { Friend } from '../../models/friend-model.js';
interface AppData extends Dataset {
    friends: Friend[];
}
export declare class AppDBManager {
    private constructor();
    private static sharedInstance;
    private db;
    static getInstance(): AppDBManager;
    getDB(): Database<AppData, keyof AppData>;
    save(): void;
}
export {};
//# sourceMappingURL=db.manager.d.ts.map
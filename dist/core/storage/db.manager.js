import { Database, JsonAdapter, } from './db.js';
export class AppDBManager {
    constructor() {
        this.db = new Database('../../data/data.json', JsonAdapter);
    }
    static sharedInstance = undefined;
    db;
    static getInstance() {
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
//# sourceMappingURL=db.manager.js.map
import * as fs from 'fs';
import * as path from 'path';
// }
// export type Dataset = {
//   [key: string]: Row[];
// };
// export interface DatabaseStorageAdapter {
//   parse: (content: string) => Dataset;
//   serialize: (dataset: Dataset) => string;
// }
// export class JsonAdapter<T> implements DatabaseStorageAdapter<T>={ 
// //export const JsonStorageAdapter<T> implements DatabaseStorageAdapter = {
//   parse(content: string) {
//     try {
//       return JSON.parse(content) as T;
//     } catch (e) {
//       console.error(
//         'Given filePath is not empty and its content is not valid JSON.',
//       );
//       throw e;
//     }
//   },
//   serialize(dataset: T):string {
//     return JSON.stringify(dataset);
//   },
// };
export class JsonAdapter {
    parse(content) {
        try {
            return JSON.parse(content);
        }
        catch (e) {
            console.error("Given filePath is not empty and its content is not valid JSON.");
            throw e;
        }
    }
    serialize(dataset) {
        return JSON.stringify(dataset);
    }
}
export class Database {
    filePath;
    adapter;
    dataStore = {};
    constructor(filePath, adapter) {
        this.filePath = filePath;
        this.adapter = adapter;
        if (!filePath) {
            throw new Error('Missing file path argument.');
        }
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        let stats;
        try {
            stats = fs.statSync(filePath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return;
            }
            else if (err.code === 'EACCES') {
                throw new Error(`Cannot access path "${filePath}".`);
            }
            else {
                throw new Error(`Error while checking for existence of path "${filePath}": ${err}`);
            }
        }
        try {
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
        }
        catch (err) {
            throw new Error(`Cannot read & write on path "${filePath}". Check permissions!`);
        }
        if (stats.size > 0) {
            let data;
            try {
                data = fs.readFileSync(filePath, { encoding: 'utf-8' });
            }
            catch (err) {
                throw err;
            }
            this.dataStore = this.adapter.parse(data);
        }
    }
    table(tableName) {
        if (this.dataStore[tableName] === undefined) {
            this.dataStore[tableName] = [];
        }
        return this.dataStore[tableName];
    }
    async save() {
        try {
            await fs.promises.writeFile(this.filePath, this.adapter.serialize(this.dataStore));
        }
        catch (e) {
            console.error('Failed to save data to the given filePath.');
            throw e;
        }
    }
}
//# sourceMappingURL=db.js.map
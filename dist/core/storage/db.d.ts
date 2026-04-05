export type ColumnData = string | number | boolean | null;
export type Row = Record<string, ColumnData>;
export type Dataset = {
    [key: string]: Row[];
};
export interface DatabaseStorageAdapter {
    parse: (content: string) => Dataset;
    serialize: (dataset: Dataset) => string;
}
export declare const JsonAdapter: DatabaseStorageAdapter;
export declare class Database<T extends Dataset, K extends keyof T> {
    private readonly filePath;
    private readonly adapter;
    private readonly dataStore;
    constructor(filePath: string, adapter?: DatabaseStorageAdapter);
    table(tableName: K): T[K];
    save(): Promise<void>;
}
//# sourceMappingURL=db.d.ts.map
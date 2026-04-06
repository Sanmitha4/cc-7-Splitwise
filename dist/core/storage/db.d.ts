export type ColumnData = string | number | boolean | null;
export type Row = Record<string, ColumnData>;
type Table = Row[];
export interface DatabaseStorageAdaptor<T> {
    parse: (content: string) => T;
    serialize: (dataset: T) => string;
}
export declare class JsonAdapter<T> implements DatabaseStorageAdapter<T> {
    parse(content: string): T;
    serialize(dataset: T): string;
}
export declare class Database<T extends {
    [K in keyof T]: Table[];
}> {
    private readonly filePath;
    private readonly adapter;
    private readonly dataStore;
    constructor(filePath: string, adapter: DatabaseStorageAdapter<T>);
    table(tableName: keyof T): T[keyof T];
    save(): Promise<void>;
}
export {};
//# sourceMappingURL=db.d.ts.map
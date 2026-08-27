export interface LevelDbReaderCase {
    readonly name: string;
    readonly compression: number;
    readonly splitLog: boolean;
    readonly expected: Readonly<Record<string, string>>;
}

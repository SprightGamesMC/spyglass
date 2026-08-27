export interface CommandBlockCase {
    readonly name: string;
    readonly command: string;
    readonly version?: number;
    readonly source: "block" | "minecart";
    readonly expectedIds: readonly string[];
}

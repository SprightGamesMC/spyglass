export type CommandFileKind = "mcfunction" | "dialogue";

export interface UnknownCommandCase {
    readonly name: string;
    readonly source: CommandFileKind;
    readonly lines: readonly string[];
    readonly expectedMessages: readonly string[];
    readonly expectedLines: readonly (number | undefined)[];
}

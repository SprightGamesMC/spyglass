export interface LevelDatCase {
    readonly name: string;
    readonly levelDat: "valid" | "random" | "absent" | "old_only";
    readonly expectedPath?: string;
}

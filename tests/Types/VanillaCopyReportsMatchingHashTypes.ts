export interface VanillaCopyReportsMatchingHashCase {
    readonly name: string;
    readonly textureBytes: string;
    readonly subpackTextureBytes?: string;
    readonly uiHudProperty: number;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
    readonly expectedFields: readonly string[];
}

export interface AssetUnusedReportsUnreferencedAssetCase {
    readonly name: string;
    readonly referenceTexture: boolean;
    readonly includeUnusedFiles: boolean;
    readonly includeSubpackFiles?: boolean;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

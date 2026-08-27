export interface SkinPackFixtureOptions {
    readonly skinsJson?: object | string;
    readonly omitSkinsJson?: boolean;
    readonly textures?: Readonly<Record<string, Uint8Array>>;
    readonly langFiles?: Readonly<Record<string, string>>;
}

export interface SkinCheckCase extends SkinPackFixtureOptions {
    readonly name: string;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

import type { ContentType } from "../../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Core/FixtureTypes.js";

export interface MarketplaceCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly contentType?: ContentType;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

export interface PackReference {
    readonly pack_id: string;
    readonly version: readonly number[];
}

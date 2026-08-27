import type { FixtureFiles, FixtureOptions } from "../Core/FixtureTypes.js";

export type ManifestObject = Record<string, unknown>;

export interface ManifestCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedIds: readonly string[];
    readonly expectedFields?: readonly string[];
    readonly expectedPaths?: readonly string[];
    readonly options?: FixtureOptions;
}

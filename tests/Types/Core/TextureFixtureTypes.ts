import type { FixtureFiles, FixtureOptions } from "./FixtureTypes.js";

export interface TextureCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly options?: FixtureOptions;
    readonly expectedIds: readonly string[];
    readonly expectedPaths?: readonly string[];
}

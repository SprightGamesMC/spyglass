import type { FixtureFiles } from "./FixtureTypes.js";

export interface LangCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

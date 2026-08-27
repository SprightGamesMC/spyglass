import type { FixtureFiles } from "./Core/FixtureTypes.js";

export interface MultipleManifestsReportsNestedManifestInPackCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedPacks: readonly string[];
}

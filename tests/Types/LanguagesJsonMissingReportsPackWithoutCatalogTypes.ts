import type { FixtureFiles } from "./Core/FixtureTypes.js";

export interface LanguagesJsonMissingReportsPackWithoutCatalogCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedPacks: readonly string[];
}

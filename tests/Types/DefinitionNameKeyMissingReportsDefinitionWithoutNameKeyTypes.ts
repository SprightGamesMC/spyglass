import type { FixtureFiles } from "./Core/FixtureTypes.js";

export interface DefinitionNameKeyMissingReportsDefinitionWithoutNameKeyCase {
    readonly name: string;
    readonly definition: FixtureFiles;
    readonly lang?: string;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

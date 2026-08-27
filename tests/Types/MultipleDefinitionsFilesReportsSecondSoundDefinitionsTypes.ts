import type { FixtureFiles } from "./Core/FixtureTypes.js";

export interface MultipleDefinitionsFilesReportsSecondSoundDefinitionsCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultipleDefinitionsFilesReportsSecondSoundDefinitionsCase } from "../Types/MultipleDefinitionsFilesReportsSecondSoundDefinitionsTypes.js";
import MultipleDefinitionsFiles from "../../src/Checks/Sound/MultipleDefinitionsFiles.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MultipleDefinitionsFilesReportsSecondSoundDefinitions {
    static readonly ID = "SOUND/601";
    static readonly CATALOG = { format_version: "1.14.0", sound_definitions: {} };
    static readonly CASES: readonly MultipleDefinitionsFilesReportsSecondSoundDefinitionsCase[] = [
        {
            name: "one sound_definitions.json in the sounds folder is the only catalog",
            files: {
                "RP/manifest.json": ModelFixture.resourceManifest(),
                "RP/sounds/sound_definitions.json": MultipleDefinitionsFilesReportsSecondSoundDefinitions.CATALOG,
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "one sound_definitions.json in each of two packs is one catalog per pack",
            files: {
                "RP/manifest.json": ModelFixture.resourceManifest(),
                "RP/sounds/sound_definitions.json": MultipleDefinitionsFilesReportsSecondSoundDefinitions.CATALOG,
                "RP2/manifest.json": ModelFixture.resourceManifest({
                    header: { ...(ModelFixture.resourceManifest().header as object), uuid: "1b4c7e4a-3f4d-4e5c-9a0b-2c3d4e5f6a7b" },
                }),
                "RP2/sounds/sound_definitions.json": MultipleDefinitionsFilesReportsSecondSoundDefinitions.CATALOG,
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "sounds and Sounds folders each containing sound_definitions.json make two files in one pack",
            files: {
                "RP/manifest.json": ModelFixture.resourceManifest(),
                "RP/sounds/sound_definitions.json": MultipleDefinitionsFilesReportsSecondSoundDefinitions.CATALOG,
                "RP/Sounds/sound_definitions.json": MultipleDefinitionsFilesReportsSecondSoundDefinitions.CATALOG,
            },
            expectedIds: ["SOUND/601"],
            expectedPaths: ["RP/Sounds/sound_definitions.json"],
        },
    ];

    static run(entry: MultipleDefinitionsFilesReportsSecondSoundDefinitionsCase): Promise<FindingSummary> {
        return ModelFixture.summary(new MultipleDefinitionsFiles(), entry.files);
    }
}

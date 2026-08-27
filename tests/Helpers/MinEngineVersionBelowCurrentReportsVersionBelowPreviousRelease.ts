import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MinEngineVersionBelowCurrentReportsVersionBelowPreviousReleaseCase } from "../Types/MinEngineVersionBelowCurrentReportsVersionBelowPreviousReleaseTypes.js";
import MinEngineVersionBelowCurrent from "../../src/Checks/Manifest/MinEngineVersionBelowCurrent.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class MinEngineVersionBelowCurrentReportsVersionBelowPreviousRelease {
    static readonly ID = "MANIFEST/502";
    static readonly CASES: readonly MinEngineVersionBelowCurrentReportsVersionBelowPreviousReleaseCase[] = [
        {
            name: "min_engine_version 10.29.0 is the previous release of current 10.30.20",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 29, 0]),
            expectedIds: [],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "min_engine_version 10.30.0 shares the minor of current 10.30.20",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 30, 0]),
            expectedIds: [],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "min_engine_version 10.28.0 is below the previous release 10.29",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 28, 0]),
            expectedIds: ["MANIFEST/502"],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "min_engine_version 0.30.0 has a major below current 10.30.20",
            files: ManifestFixture.behaviorWithMinEngineVersion([0, 30, 0]),
            expectedIds: ["MANIFEST/502"],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "resource pack min_engine_version 10.20.0 is below the previous release 10.29",
            files: ManifestFixture.resourceWithMinEngineVersion([10, 20, 0]),
            expectedIds: ["MANIFEST/502"],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "world template min_engine_version 1.10.0 is not a pack type the release check applies to",
            files: ManifestFixture.worldTemplateWithMinEngineVersion([1, 10, 0]),
            expectedIds: [],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
    ];

    static async run(entry: MinEngineVersionBelowCurrentReportsVersionBelowPreviousReleaseCase): Promise<FindingSummary> {
        return ManifestFixture.run(new MinEngineVersionBelowCurrent(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MinEngineVersionAboveCurrentReportsMinorAboveCurrentReleaseCase } from "../Types/MinEngineVersionAboveCurrentReportsMinorAboveCurrentReleaseTypes.js";
import MinEngineVersionAboveCurrent from "../../src/Checks/Manifest/MinEngineVersionAboveCurrent.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class MinEngineVersionAboveCurrentReportsMinorAboveCurrentRelease {
    static readonly ID = "MANIFEST/503";
    static readonly CASES: readonly MinEngineVersionAboveCurrentReportsMinorAboveCurrentReleaseCase[] = [
        {
            name: "min_engine_version 10.30.90 shares the minor of current 10.30.20",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 30, 90]),
            expectedIds: [],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "min_engine_version 10.31.0 has a minor above current 10.30.20",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 31, 0]),
            expectedIds: ["MANIFEST/503"],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "resource pack min_engine_version 11.0.0 has a major above current 10.30.20",
            files: ManifestFixture.resourceWithMinEngineVersion([11, 0, 0]),
            expectedIds: ["MANIFEST/503"],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "world template min_engine_version 11.0.0 is not a pack type the release check applies to",
            files: ManifestFixture.worldTemplateWithMinEngineVersion([11, 0, 0]),
            expectedIds: [],
            options: { currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION },
        },
        {
            name: "min_engine_version 10.31.0 is not above a supplied current version 10.31.10",
            files: ManifestFixture.behaviorWithMinEngineVersion([10, 31, 0]),
            expectedIds: [],
            options: { currentGameVersion: "10.31.10" },
        },
    ];

    static async run(entry: MinEngineVersionAboveCurrentReportsMinorAboveCurrentReleaseCase): Promise<FindingSummary> {
        return ManifestFixture.run(new MinEngineVersionAboveCurrent(), entry);
    }
}

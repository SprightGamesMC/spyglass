import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersionCase } from "../Types/PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersionTypes.js";
import PbrMinEngineVersionTooLow from "../../src/Checks/Manifest/PbrMinEngineVersionTooLow.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersion {
    static readonly ID = "MANIFEST/505";
    static readonly CASES: readonly PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersionCase[] = [
        {
            name: "pbr capability with min_engine_version 1.21.120 meets the minimum version",
            files: ManifestFixture.resourceWithTextureSet({ capabilities: ["pbr"] }, ["color"], [1, 21, 120]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "min_engine_version 1.21.0 without pbr capability has no minimum version",
            files: ManifestFixture.resourceWithTextureSet({}, ["color"], [1, 21, 0]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "pbr capability with min_engine_version 1.21.0 is below 1.21.120",
            files: ManifestFixture.resourceWithTextureSet({ capabilities: ["pbr"] }, ["color"], [1, 21, 0]),
            expectedIds: ["MANIFEST/505"],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static async run(entry: PbrMinEngineVersionTooLowReportsPbrBelowMinimumVersionCase): Promise<FindingSummary> {
        return ManifestFixture.run(new PbrMinEngineVersionTooLow(), entry);
    }
}

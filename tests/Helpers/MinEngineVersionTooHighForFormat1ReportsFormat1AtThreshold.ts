import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MinEngineVersionTooHighForFormat1ReportsFormat1AtThresholdCase } from "../Types/MinEngineVersionTooHighForFormat1ReportsFormat1AtThresholdTypes.js";
import MinEngineVersionTooHighForFormat1 from "../../src/Checks/Manifest/MinEngineVersionTooHighForFormat1.js";
import ModelFixture from "./Core/ModelFixture.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class MinEngineVersionTooHighForFormat1ReportsFormat1AtThreshold {
    static readonly ID = "MANIFEST/205";
    static readonly CASES: readonly MinEngineVersionTooHighForFormat1ReportsFormat1AtThresholdCase[] = [
        {
            name: "resource pack format_version 1 with min_engine_version 1.12.0 is below the 1.13.0 threshold",
            files: { "RP/manifest.json": ManifestFixture.resourceFormat1([1, 12, 0]) },
            expectedIds: [],
        },
        {
            name: "resource pack format_version 1 with min_engine_version 1.13.0 is at the threshold",
            files: { "RP/manifest.json": ManifestFixture.resourceFormat1([1, 13, 0]) },
            expectedIds: ["MANIFEST/205"],
        },
        {
            name: "resource pack format_version 2 with min_engine_version 1.13.0 is not format 1",
            files: { "RP/manifest.json": ModelFixture.resourceManifest() },
            expectedIds: [],
        },
        {
            name: "behavior pack format_version 1 with min_engine_version 1.13.0 is not a resource pack",
            files: { "BP/manifest.json": ModelFixture.behaviorManifest({ format_version: 1 }) },
            expectedIds: [],
        },
        {
            name: "education resource pack format_version 1 with min_engine_version 1.14.0 is below the 1.15.0 education threshold",
            files: ManifestFixture.educationWorld([1, 14, 0]),
            expectedIds: [],
        },
        {
            name: "education resource pack format_version 1 with min_engine_version 1.15.0 is at the education threshold",
            files: ManifestFixture.educationWorld([1, 15, 0]),
            expectedIds: ["MANIFEST/205"],
        },
    ];

    static async run(entry: MinEngineVersionTooHighForFormat1ReportsFormat1AtThresholdCase): Promise<FindingSummary> {
        return ManifestFixture.run(new MinEngineVersionTooHighForFormat1(), entry);
    }
}

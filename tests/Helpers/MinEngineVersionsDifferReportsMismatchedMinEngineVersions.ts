import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MinEngineVersionsDifferReportsMismatchedMinEngineVersionsCase } from "../Types/MinEngineVersionsDifferReportsMismatchedMinEngineVersionsTypes.js";
import MinEngineVersionsDiffer from "../../src/Checks/Marketplace/MinEngineVersionsDiffer.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MinEngineVersionsDifferReportsMismatchedMinEngineVersions {
    static readonly ID = "MARKETPLACE/207";
    static readonly CASES: readonly MinEngineVersionsDifferReportsMismatchedMinEngineVersionsCase[] = [
        {
            name: "behavior and resource manifests with equal min_engine_version agree",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "resource min_engine_version 1.20.0 differs from the behavior pack value",
            files: MarketplaceFixture.withResourceHeader({ min_engine_version: [1, 20, 0] }),
            expectedIds: ["MARKETPLACE/207"],
            expectedPaths: [MarketplaceFixture.RESOURCE_MANIFEST],
        },
    ];

    static async run(entry: MinEngineVersionsDifferReportsMismatchedMinEngineVersionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MinEngineVersionsDiffer(), entry);
    }
}

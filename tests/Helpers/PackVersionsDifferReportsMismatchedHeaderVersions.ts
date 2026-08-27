import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackVersionsDifferReportsMismatchedHeaderVersionsCase } from "../Types/PackVersionsDifferReportsMismatchedHeaderVersionsTypes.js";
import PackVersionsDiffer from "../../src/Checks/Marketplace/PackVersionsDiffer.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PackVersionsDifferReportsMismatchedHeaderVersions {
    static readonly ID = "MARKETPLACE/206";
    static readonly CASES: readonly PackVersionsDifferReportsMismatchedHeaderVersionsCase[] = [
        {
            name: "behavior and resource manifests with equal header versions agree",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "resource header version 1.0.1 differs from the behavior pack version",
            files: MarketplaceFixture.withResourceHeader({ version: [1, 0, 1] }),
            expectedIds: ["MARKETPLACE/206"],
            expectedPaths: [MarketplaceFixture.RESOURCE_MANIFEST],
        },
    ];

    static async run(entry: PackVersionsDifferReportsMismatchedHeaderVersionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PackVersionsDiffer(), entry);
    }
}

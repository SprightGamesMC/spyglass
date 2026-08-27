import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackFolderAcronymMismatchReportsDifferentAcronymsCase } from "../Types/PackFolderAcronymMismatchReportsDifferentAcronymsTypes.js";
import PackFolderAcronymMismatch from "../../src/Checks/Marketplace/PackFolderAcronymMismatch.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PackFolderAcronymMismatchReportsDifferentAcronyms {
    static readonly ID = "MARKETPLACE/202";
    static readonly OTHER_ACRONYM_ROOT = "Content/resource_packs/RP_ABC";
    static readonly CASES: readonly PackFolderAcronymMismatchReportsDifferentAcronymsCase[] = [
        {
            name: "BP_TST and RP_TST share the same acronym",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "RP_ABC uses a different acronym from BP_TST",
            files: MarketplaceFixture.renameFolder(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.RESOURCE_ROOT,
                PackFolderAcronymMismatchReportsDifferentAcronyms.OTHER_ACRONYM_ROOT
            ),
            expectedIds: ["MARKETPLACE/202"],
            expectedPaths: [PackFolderAcronymMismatchReportsDifferentAcronyms.OTHER_ACRONYM_ROOT],
        },
    ];

    static async run(entry: PackFolderAcronymMismatchReportsDifferentAcronymsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PackFolderAcronymMismatch(), entry);
    }
}

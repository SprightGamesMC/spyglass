import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackFolderCountInvalidReportsSecondPackInFolderCase } from "../Types/PackFolderCountInvalidReportsSecondPackInFolderTypes.js";
import PackFolderCountInvalid from "../../src/Checks/Marketplace/PackFolderCountInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PackFolderCountInvalidReportsSecondPackInFolder {
    static readonly ID = "MARKETPLACE/209";
    static readonly SECOND_RESOURCE_ROOT = "Content/resource_packs/RP_TST2";
    static readonly CASES: readonly PackFolderCountInvalidReportsSecondPackInFolderCase[] = [
        {
            name: "one BP_TST and one RP_TST folder are the one pack per folder allowed",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "RP_TST and RP_TST2 under resource_packs are more than the one pack per folder allowed",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [PackFolderCountInvalidReportsSecondPackInFolder.SECOND_RESOURCE_ROOT + "/manifest.json"]:
                    MarketplaceFixture.resourceManifest(),
            },
            expectedIds: ["MARKETPLACE/209", "MARKETPLACE/209"],
            expectedPaths: [MarketplaceFixture.RESOURCE_ROOT, PackFolderCountInvalidReportsSecondPackInFolder.SECOND_RESOURCE_ROOT],
        },
    ];

    static async run(entry: PackFolderCountInvalidReportsSecondPackInFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PackFolderCountInvalid(), entry);
    }
}

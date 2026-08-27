import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreArtFolderMissingReportsAbsentFolderCase } from "../Types/StoreArtFolderMissingReportsAbsentFolderTypes.js";
import StoreArtFolderMissing from "../../src/Checks/Art/StoreArtFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreArtFolderMissingReportsAbsentFolder {
    static readonly ID = "ART/102";
    static readonly CASES: readonly StoreArtFolderMissingReportsAbsentFolderCase[] = [
        {
            name: "Store Art folder at the root satisfies the required folder",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "submission without a Store Art folder lacks the required root folder",
            files: MarketplaceFixture.withoutFolder(MarketplaceFixture.addonSubmission(), MarketplaceFixture.STORE_FOLDER),
            expectedIds: ["ART/102"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: StoreArtFolderMissingReportsAbsentFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreArtFolderMissing(), entry);
    }
}

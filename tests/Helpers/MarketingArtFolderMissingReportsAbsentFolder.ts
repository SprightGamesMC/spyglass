import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingArtFolderMissingReportsAbsentFolderCase } from "../Types/MarketingArtFolderMissingReportsAbsentFolderTypes.js";
import MarketingArtFolderMissing from "../../src/Checks/Art/MarketingArtFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingArtFolderMissingReportsAbsentFolder {
    static readonly ID = "ART/101";
    static readonly CASES: readonly MarketingArtFolderMissingReportsAbsentFolderCase[] = [
        {
            name: "Marketing Art folder at the root satisfies the required folder",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "submission without a Marketing Art folder lacks the required root folder",
            files: MarketplaceFixture.withoutFolder(MarketplaceFixture.addonSubmission(), MarketplaceFixture.MARKETING_FOLDER),
            expectedIds: ["ART/101"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: MarketingArtFolderMissingReportsAbsentFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingArtFolderMissing(), entry);
    }
}

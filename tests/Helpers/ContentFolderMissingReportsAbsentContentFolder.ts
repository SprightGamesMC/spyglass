import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ContentFolderMissingReportsAbsentContentFolderCase } from "../Types/ContentFolderMissingReportsAbsentContentFolderTypes.js";
import ContentFolderMissing from "../../src/Checks/Marketplace/ContentFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ContentFolderMissingReportsAbsentContentFolder {
    static readonly ID = "MARKETPLACE/101";
    static readonly CASES: readonly ContentFolderMissingReportsAbsentContentFolderCase[] = [
        {
            name: "Content folder at the root is present",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "submission with only art folders has no Content folder",
            files: { ...MarketplaceFixture.marketingArt(), ...MarketplaceFixture.storeArt() },
            expectedIds: ["MARKETPLACE/101"],
            expectedPaths: [""],
        },
        {
            name: "lower case content folder does not match Content",
            files: MarketplaceFixture.renameFolder(MarketplaceFixture.addonSubmission(), "Content", "content"),
            expectedIds: ["MARKETPLACE/101"],
            expectedPaths: ["content"],
        },
    ];

    static async run(entry: ContentFolderMissingReportsAbsentContentFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ContentFolderMissing(), entry);
    }
}

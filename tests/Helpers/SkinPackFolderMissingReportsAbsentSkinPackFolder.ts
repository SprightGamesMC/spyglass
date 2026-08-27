import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SkinPackFolderMissingReportsAbsentSkinPackFolderCase } from "../Types/SkinPackFolderMissingReportsAbsentSkinPackFolderTypes.js";
import SkinPackFolderMissing from "../../src/Checks/Marketplace/SkinPackFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class SkinPackFolderMissingReportsAbsentSkinPackFolder {
    static readonly ID = "MARKETPLACE/103";
    static readonly CASES: readonly SkinPackFolderMissingReportsAbsentSkinPackFolderCase[] = [
        {
            name: "Content/skin_pack folder is present for skin content",
            files: MarketplaceFixture.skinSubmission(),
            contentType: "skin",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "skin content without Content/skin_pack lacks the skin pack folder",
            files: MarketplaceFixture.addonSubmission(),
            contentType: "skin",
            expectedIds: ["MARKETPLACE/103"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: SkinPackFolderMissingReportsAbsentSkinPackFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new SkinPackFolderMissing(), entry);
    }
}

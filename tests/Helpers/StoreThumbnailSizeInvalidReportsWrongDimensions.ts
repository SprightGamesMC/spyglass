import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreThumbnailSizeInvalidReportsWrongDimensionsCase } from "../Types/StoreThumbnailSizeInvalidReportsWrongDimensionsTypes.js";
import StoreThumbnailSizeInvalid from "../../src/Checks/Art/StoreThumbnailSizeInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreThumbnailSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/204";
    static readonly CASES: readonly StoreThumbnailSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "800 by 450 store thumbnail is the required size",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "1920 by 1080 store thumbnail is not 800 by 450",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.THUMBNAIL]: MarketplaceFixture.storeImage(1920, 1080) },
            expectedIds: ["ART/204"],
            expectedPaths: [MarketplaceFixture.THUMBNAIL],
        },
    ];

    static async run(entry: StoreThumbnailSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreThumbnailSizeInvalid(), entry);
    }
}

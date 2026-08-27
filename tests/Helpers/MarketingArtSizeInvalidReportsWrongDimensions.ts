import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingArtSizeInvalidReportsWrongDimensionsCase } from "../Types/MarketingArtSizeInvalidReportsWrongDimensionsTypes.js";
import MarketingArtSizeInvalid from "../../src/Checks/Art/MarketingArtSizeInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingArtSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/210";
    static readonly CASES: readonly MarketingArtSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "1920 by 1080 marketing art is the required size",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "1280 by 720 key art is not 1920 by 1080",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.KEY_ART]: ImageBytes.jpeg({ width: 1280, height: 720, dpi: 300 }),
            },
            expectedIds: ["ART/210"],
            expectedPaths: [MarketplaceFixture.KEY_ART],
        },
    ];

    static async run(entry: MarketingArtSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingArtSizeInvalid(), entry);
    }
}

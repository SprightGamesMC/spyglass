import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreScreenshotSizeInvalidReportsWrongDimensionsCase } from "../Types/StoreScreenshotSizeInvalidReportsWrongDimensionsTypes.js";
import StoreScreenshotSizeInvalid from "../../src/Checks/Art/StoreScreenshotSizeInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreScreenshotSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/205";
    static readonly FIRST_SCREENSHOT = MarketplaceFixture.storeScreenshot(0);
    static readonly CASES: readonly StoreScreenshotSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "800 by 450 store screenshots are the required size",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "800 by 600 store screenshot is not 800 by 450",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [StoreScreenshotSizeInvalidReportsWrongDimensions.FIRST_SCREENSHOT]: MarketplaceFixture.storeImage(800, 600),
            },
            expectedIds: ["ART/205"],
            expectedPaths: [StoreScreenshotSizeInvalidReportsWrongDimensions.FIRST_SCREENSHOT],
        },
    ];

    static async run(entry: StoreScreenshotSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreScreenshotSizeInvalid(), entry);
    }
}

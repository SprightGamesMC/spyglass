import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreScreenshotCountInvalidReportsWrongCountCase } from "../Types/StoreScreenshotCountInvalidReportsWrongCountTypes.js";
import StoreScreenshotCountInvalid from "../../src/Checks/Art/StoreScreenshotCountInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreScreenshotCountInvalidReportsWrongCount {
    static readonly ID = "ART/402";
    static readonly LAST_INDEX = MarketplaceFixture.SCREENSHOT_COUNT - 1;
    static readonly CASES: readonly StoreScreenshotCountInvalidReportsWrongCountCase[] = [
        {
            name: "5 store screenshots is exactly the required count",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "4 store screenshots is not exactly 5",
            files: MarketplaceFixture.without(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.storeScreenshot(StoreScreenshotCountInvalidReportsWrongCount.LAST_INDEX)
            ),
            expectedIds: ["ART/402"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
        {
            name: "6 store screenshots is not exactly 5",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.storeScreenshot(MarketplaceFixture.SCREENSHOT_COUNT)]: MarketplaceFixture.storeImage(800, 450),
            },
            expectedIds: ["ART/402"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
    ];

    static async run(entry: StoreScreenshotCountInvalidReportsWrongCountCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreScreenshotCountInvalid(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingScreenshotsTooFewReportsCountBelowMinimumCase } from "../Types/MarketingScreenshotsTooFewReportsCountBelowMinimumTypes.js";
import MarketingScreenshotsTooFew from "../../src/Checks/Art/MarketingScreenshotsTooFew.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingScreenshotsTooFewReportsCountBelowMinimum {
    static readonly ID = "ART/401";
    static readonly LAST_INDEX = MarketplaceFixture.SCREENSHOT_COUNT - 1;
    static readonly CASES: readonly MarketingScreenshotsTooFewReportsCountBelowMinimumCase[] = [
        {
            name: "5 marketing screenshots meet the minimum of 5",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "6 marketing screenshots are above the minimum of 5",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.marketingScreenshot(MarketplaceFixture.SCREENSHOT_COUNT)]: MarketplaceFixture.marketingImage(),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "4 marketing screenshots are below the minimum of 5",
            files: MarketplaceFixture.without(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.marketingScreenshot(MarketingScreenshotsTooFewReportsCountBelowMinimum.LAST_INDEX)
            ),
            expectedIds: ["ART/401"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: MarketingScreenshotsTooFewReportsCountBelowMinimumCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingScreenshotsTooFew(), entry);
    }
}

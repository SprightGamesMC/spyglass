import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingArtDpiInvalidReportsWrongDensityCase } from "../Types/MarketingArtDpiInvalidReportsWrongDensityTypes.js";
import MarketingArtDpiInvalid from "../../src/Checks/Art/MarketingArtDpiInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingArtDpiInvalidReportsWrongDensity {
    static readonly ID = "ART/211";
    static readonly CASES: readonly MarketingArtDpiInvalidReportsWrongDensityCase[] = [
        {
            name: "300 DPI marketing art matches the required marketing art density",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "72 DPI key art is not 300 DPI",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.KEY_ART]: MarketplaceFixture.marketingImage(72) },
            expectedIds: ["ART/211"],
            expectedPaths: [MarketplaceFixture.KEY_ART],
        },
        {
            name: "300 DPI PSD key art matches the required marketing art density",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.PSD_KEY_ART]: ImageBytes.psd({ width: 1920, height: 1080, dpi: 300 }),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "PSD key art without DPI metadata cannot prove it is 300 DPI",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.PSD_KEY_ART]: ImageBytes.psd({ width: 1920, height: 1080 }),
            },
            expectedIds: ["ART/211"],
            expectedPaths: [MarketplaceFixture.PSD_KEY_ART],
        },
    ];

    static async run(entry: MarketingArtDpiInvalidReportsWrongDensityCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingArtDpiInvalid(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreArtDpiInvalidReportsWrongDensityCase } from "../Types/StoreArtDpiInvalidReportsWrongDensityTypes.js";
import StoreArtDpiInvalid from "../../src/Checks/Art/StoreArtDpiInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreArtDpiInvalidReportsWrongDensity {
    static readonly ID = "ART/208";
    static readonly CASES: readonly StoreArtDpiInvalidReportsWrongDensityCase[] = [
        {
            name: "72 DPI store art matches the required store art density",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "300 DPI store thumbnail is not 72 DPI",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.THUMBNAIL]: MarketplaceFixture.storeImage(800, 450, 300),
            },
            expectedIds: ["ART/208"],
            expectedPaths: [MarketplaceFixture.THUMBNAIL],
        },
        {
            name: "store thumbnail without DPI metadata cannot prove it is 72 DPI",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.THUMBNAIL]: ImageBytes.jpeg({ width: 800, height: 450 }),
            },
            expectedIds: ["ART/208"],
            expectedPaths: [MarketplaceFixture.THUMBNAIL],
        },
    ];

    static async run(entry: StoreArtDpiInvalidReportsWrongDensityCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreArtDpiInvalid(), entry);
    }
}

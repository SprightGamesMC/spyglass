import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StorePanoramaSizeInvalidReportsWrongDimensionsCase } from "../Types/StorePanoramaSizeInvalidReportsWrongDimensionsTypes.js";
import StorePanoramaSizeInvalid from "../../src/Checks/Art/StorePanoramaSizeInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StorePanoramaSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/206";
    static readonly CASES: readonly StorePanoramaSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "2000 by 450 panorama has height 450 and width within 1000 to 4000",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "900 by 450 panorama is narrower than the 1000 minimum width",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.PANORAMA]: MarketplaceFixture.storeImage(900, 450) },
            expectedIds: ["ART/206"],
            expectedPaths: [MarketplaceFixture.PANORAMA],
        },
        {
            name: "2000 by 400 panorama does not have height 450",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.PANORAMA]: MarketplaceFixture.storeImage(2000, 400) },
            expectedIds: ["ART/206"],
            expectedPaths: [MarketplaceFixture.PANORAMA],
        },
    ];

    static async run(entry: StorePanoramaSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StorePanoramaSizeInvalid(), entry);
    }
}

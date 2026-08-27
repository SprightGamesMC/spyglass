import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StorePanoramaMissingReportsAbsentPanoramaCase } from "../Types/StorePanoramaMissingReportsAbsentPanoramaTypes.js";
import StorePanoramaMissing from "../../src/Checks/Art/StorePanoramaMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StorePanoramaMissingReportsAbsentPanorama {
    static readonly ID = "ART/106";
    static readonly CASES: readonly StorePanoramaMissingReportsAbsentPanoramaCase[] = [
        {
            name: "panorama file in Store Art satisfies the store panorama requirement",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Store Art without a panorama file lacks the required store panorama",
            files: MarketplaceFixture.without(MarketplaceFixture.addonSubmission(), MarketplaceFixture.PANORAMA),
            expectedIds: ["ART/106"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
    ];

    static async run(entry: StorePanoramaMissingReportsAbsentPanoramaCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StorePanoramaMissing(), entry);
    }
}

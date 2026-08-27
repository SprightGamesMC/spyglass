import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StorePackIconMissingReportsAbsentPackIconCase } from "../Types/StorePackIconMissingReportsAbsentPackIconTypes.js";
import StorePackIconMissing from "../../src/Checks/Art/StorePackIconMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StorePackIconMissingReportsAbsentPackIcon {
    static readonly ID = "ART/107";
    static readonly CASES: readonly StorePackIconMissingReportsAbsentPackIconCase[] = [
        {
            name: "pack icon file in Store Art satisfies the store pack icon requirement",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Store Art without a pack icon file lacks the required store pack icon",
            files: MarketplaceFixture.without(MarketplaceFixture.addonSubmission(), MarketplaceFixture.PACK_ICON),
            expectedIds: ["ART/107"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
    ];

    static async run(entry: StorePackIconMissingReportsAbsentPackIconCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StorePackIconMissing(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StorePackIconSizeInvalidReportsWrongDimensionsCase } from "../Types/StorePackIconSizeInvalidReportsWrongDimensionsTypes.js";
import StorePackIconSizeInvalid from "../../src/Checks/Art/StorePackIconSizeInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StorePackIconSizeInvalidReportsWrongDimensions {
    static readonly ID = "ART/207";
    static readonly CASES: readonly StorePackIconSizeInvalidReportsWrongDimensionsCase[] = [
        {
            name: "256 by 256 pack icon is the required size",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "128 by 128 pack icon is not 256 by 256",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.PACK_ICON]: MarketplaceFixture.storeImage(128, 128) },
            expectedIds: ["ART/207"],
            expectedPaths: [MarketplaceFixture.PACK_ICON],
        },
    ];

    static async run(entry: StorePackIconSizeInvalidReportsWrongDimensionsCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StorePackIconSizeInvalid(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreArtFormatInvalidReportsNonJpegFileCase } from "../Types/StoreArtFormatInvalidReportsNonJpegFileTypes.js";
import StoreArtFormatInvalid from "../../src/Checks/Art/StoreArtFormatInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreArtFormatInvalidReportsNonJpegFile {
    static readonly ID = "ART/203";
    static readonly CASES: readonly StoreArtFormatInvalidReportsNonJpegFileCase[] = [
        {
            name: "JPEG store art is the required store art format",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "PNG bytes in the store thumbnail are not JPEG",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.THUMBNAIL]: ImageBytes.png({ width: 800, height: 450 }) },
            expectedIds: ["ART/203"],
            expectedPaths: [MarketplaceFixture.THUMBNAIL],
        },
    ];

    static async run(entry: StoreArtFormatInvalidReportsNonJpegFileCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreArtFormatInvalid(), entry);
    }
}

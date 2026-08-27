import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingArtFormatInvalidReportsNonJpegOrPsdFileCase } from "../Types/MarketingArtFormatInvalidReportsNonJpegOrPsdFileTypes.js";
import MarketingArtFormatInvalid from "../../src/Checks/Art/MarketingArtFormatInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingArtFormatInvalidReportsNonJpegOrPsdFile {
    static readonly ID = "ART/209";
    static readonly CASES: readonly MarketingArtFormatInvalidReportsNonJpegOrPsdFileCase[] = [
        {
            name: "PSD key art is an allowed marketing art format",
            files: {
                ...MarketplaceFixture.without(MarketplaceFixture.addonSubmission(), MarketplaceFixture.KEY_ART),
                [MarketplaceFixture.PSD_KEY_ART]: ImageBytes.psd({ width: 1920, height: 1080, dpi: 300 }),
            },
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "PNG bytes in the key art are not JPEG or PSD",
            files: { ...MarketplaceFixture.addonSubmission(), [MarketplaceFixture.KEY_ART]: ImageBytes.png({ width: 1920, height: 1080 }) },
            expectedIds: ["ART/209"],
            expectedPaths: [MarketplaceFixture.KEY_ART],
        },
    ];

    static async run(entry: MarketingArtFormatInvalidReportsNonJpegOrPsdFileCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingArtFormatInvalid(), entry);
    }
}

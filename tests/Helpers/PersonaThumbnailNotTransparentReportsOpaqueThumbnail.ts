import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PersonaThumbnailNotTransparentReportsOpaqueThumbnailCase } from "../Types/PersonaThumbnailNotTransparentReportsOpaqueThumbnailTypes.js";
import PersonaThumbnailNotTransparent from "../../src/Checks/Art/PersonaThumbnailNotTransparent.js";
import ImageBytes from "./Core/ImageBytes.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PersonaThumbnailNotTransparentReportsOpaqueThumbnail {
    static readonly ID = "ART/214";
    static readonly CASES: readonly PersonaThumbnailNotTransparentReportsOpaqueThumbnailCase[] = [
        {
            name: "persona thumbnail with an alpha channel is transparent",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona thumbnail without an alpha channel is not transparent",
            files: {
                ...MarketplaceFixture.personaSubmission(),
                [MarketplaceFixture.PERSONA_THUMBNAIL]: ImageBytes.png({
                    width: 256,
                    height: 256,
                    alpha: false,
                }),
            },
            contentType: "persona",
            expectedIds: ["ART/214"],
            expectedPaths: [MarketplaceFixture.PERSONA_THUMBNAIL],
        },
    ];

    static async run(entry: PersonaThumbnailNotTransparentReportsOpaqueThumbnailCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PersonaThumbnailNotTransparent(), entry);
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PreviewGifMissingReportsAbsentPreviewGifCase } from "../Types/PreviewGifMissingReportsAbsentPreviewGifTypes.js";
import PreviewGifMissing from "../../src/Checks/Art/PreviewGifMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PreviewGifMissingReportsAbsentPreviewGif {
    static readonly ID = "ART/109";
    static readonly RUNNING_GIF = MarketplaceFixture.marketingPath(MarketplaceFixture.PIECE_ID + "_Running.gif");
    static readonly CASES: readonly PreviewGifMissingReportsAbsentPreviewGifCase[] = [
        {
            name: "persona with all four walk cycle GIFs has every required preview GIF",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona Marketing Art without the Running.gif lacks a required preview GIF",
            files: MarketplaceFixture.without(MarketplaceFixture.personaSubmission(), PreviewGifMissingReportsAbsentPreviewGif.RUNNING_GIF),
            contentType: "persona",
            expectedIds: ["ART/109"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
        {
            name: "emote with its preview GIF in Marketing Art has the required preview GIF",
            files: MarketplaceFixture.emoteSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "emote Marketing Art without the emote GIF lacks the required preview GIF",
            files: MarketplaceFixture.without(MarketplaceFixture.emoteSubmission(), MarketplaceFixture.EMOTE_GIF),
            contentType: "persona",
            expectedIds: ["ART/109"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: PreviewGifMissingReportsAbsentPreviewGifCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PreviewGifMissing(), entry);
    }
}

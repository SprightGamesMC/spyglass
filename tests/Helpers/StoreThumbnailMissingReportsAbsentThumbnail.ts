import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { StoreThumbnailMissingReportsAbsentThumbnailCase } from "../Types/StoreThumbnailMissingReportsAbsentThumbnailTypes.js";
import StoreThumbnailMissing from "../../src/Checks/Art/StoreThumbnailMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class StoreThumbnailMissingReportsAbsentThumbnail {
    static readonly ID = "ART/105";
    static readonly EMOTE_THUMBNAIL = MarketplaceFixture.storePath(MarketplaceFixture.EMOTE_ID + "_thumbnail_0.png");
    static readonly CASES: readonly StoreThumbnailMissingReportsAbsentThumbnailCase[] = [
        {
            name: "Thumbnail file in Store Art satisfies the store thumbnail requirement",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona Thumbnail file in Store Art satisfies the store thumbnail requirement",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Store Art without a Thumbnail file lacks the required store thumbnail",
            files: MarketplaceFixture.without(MarketplaceFixture.addonSubmission(), MarketplaceFixture.THUMBNAIL),
            expectedIds: ["ART/105"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
        {
            name: "emote Store Art without a thumbnail file lacks the required store thumbnail",
            files: MarketplaceFixture.without(
                MarketplaceFixture.emoteSubmission(),
                StoreThumbnailMissingReportsAbsentThumbnail.EMOTE_THUMBNAIL
            ),
            contentType: "persona",
            expectedIds: ["ART/105"],
            expectedPaths: [MarketplaceFixture.STORE_FOLDER],
        },
    ];

    static async run(entry: StoreThumbnailMissingReportsAbsentThumbnailCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new StoreThumbnailMissing(), entry);
    }
}

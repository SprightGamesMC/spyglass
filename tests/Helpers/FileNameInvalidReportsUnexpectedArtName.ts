import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { FileNameInvalidReportsUnexpectedArtNameCase } from "../Types/FileNameInvalidReportsUnexpectedArtNameTypes.js";
import FileNameInvalid from "../../src/Checks/Art/FileNameInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class FileNameInvalidReportsUnexpectedArtName {
    static readonly ID = "ART/201";
    static readonly EXTRA_MARKETING = MarketplaceFixture.marketingPath("TestPack_Extra.jpg");
    static readonly PNG_THUMBNAIL = MarketplaceFixture.storePath("testpack_Thumbnail_0.png");
    static readonly EMOTE_THUMBNAIL = MarketplaceFixture.storePath(MarketplaceFixture.EMOTE_ID + "_thumbnail_0.png");
    static readonly UPPER_EMOTE_THUMBNAIL = MarketplaceFixture.storePath(MarketplaceFixture.EMOTE_ID + "_Thumbnail_0.png");
    static readonly CASES: readonly FileNameInvalidReportsUnexpectedArtNameCase[] = [
        {
            name: "add on store and marketing art use expected names",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona piece store and marketing art use expected names",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "emote store and marketing art use expected names",
            files: MarketplaceFixture.emoteSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Marketing Art/TestPack_Extra.jpg is not an expected marketing art name",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [FileNameInvalidReportsUnexpectedArtName.EXTRA_MARKETING]: MarketplaceFixture.marketingImage(),
            },
            expectedIds: ["ART/201"],
            expectedPaths: [FileNameInvalidReportsUnexpectedArtName.EXTRA_MARKETING],
        },
        {
            name: "Store Art/testpack_Thumbnail_0.png has png instead of the expected jpg extension",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.THUMBNAIL,
                FileNameInvalidReportsUnexpectedArtName.PNG_THUMBNAIL
            ),
            expectedIds: ["ART/201"],
            expectedPaths: [FileNameInvalidReportsUnexpectedArtName.PNG_THUMBNAIL],
        },
        {
            name: "emote Store Art/em_wave_Thumbnail_0.png has an upper case thumbnail suffix that emote names do not allow",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.emoteSubmission(),
                FileNameInvalidReportsUnexpectedArtName.EMOTE_THUMBNAIL,
                FileNameInvalidReportsUnexpectedArtName.UPPER_EMOTE_THUMBNAIL
            ),
            contentType: "persona",
            expectedIds: ["ART/201"],
            expectedPaths: [FileNameInvalidReportsUnexpectedArtName.UPPER_EMOTE_THUMBNAIL],
        },
    ];

    static async run(entry: FileNameInvalidReportsUnexpectedArtNameCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new FileNameInvalid(), entry);
    }
}

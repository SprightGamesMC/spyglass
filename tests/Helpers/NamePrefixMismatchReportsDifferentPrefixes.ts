import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { NamePrefixMismatchReportsDifferentPrefixesCase } from "../Types/NamePrefixMismatchReportsDifferentPrefixesTypes.js";
import NamePrefixMismatch from "../../src/Checks/Art/NamePrefixMismatch.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class NamePrefixMismatchReportsDifferentPrefixes {
    static readonly ID = "ART/202";
    static readonly UPPER_THUMBNAIL = MarketplaceFixture.storePath("TestPack_Thumbnail_0.jpg");
    static readonly OTHER_PARTNER_ART = MarketplaceFixture.marketingPath("Other_PartnerArt.jpg");
    static readonly OTHER_PANORAMA = MarketplaceFixture.storePath("other_panorama_0.jpg");
    static readonly OTHER_PERSONA_THUMBNAIL = MarketplaceFixture.storePath("other.piece_Thumbnail_0.png");
    static readonly CASES: readonly NamePrefixMismatchReportsDifferentPrefixesCase[] = [
        {
            name: "store prefix testpack is the lower case form of marketing prefix TestPack",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "store prefix TestPack is not the lower case form of the marketing prefix",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.THUMBNAIL,
                NamePrefixMismatchReportsDifferentPrefixes.UPPER_THUMBNAIL
            ),
            expectedIds: ["ART/202"],
            expectedPaths: [NamePrefixMismatchReportsDifferentPrefixes.UPPER_THUMBNAIL],
        },
        {
            name: "marketing prefixes TestPack and Other do not share one content name",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.PARTNER_ART,
                NamePrefixMismatchReportsDifferentPrefixes.OTHER_PARTNER_ART
            ),
            expectedIds: ["ART/202"],
            expectedPaths: [NamePrefixMismatchReportsDifferentPrefixes.OTHER_PARTNER_ART],
        },
        {
            name: "store prefixes testpack and other do not share one content name when Marketing Art is absent",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.withoutFolder(MarketplaceFixture.addonSubmission(), MarketplaceFixture.MARKETING_FOLDER),
                MarketplaceFixture.PANORAMA,
                NamePrefixMismatchReportsDifferentPrefixes.OTHER_PANORAMA
            ),
            expectedIds: ["ART/202"],
            expectedPaths: [NamePrefixMismatchReportsDifferentPrefixes.OTHER_PANORAMA],
        },
        {
            name: "persona art prefix my.piece equals the piece identifier",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona thumbnail prefix other.piece differs from the piece identifier my.piece",
            files: MarketplaceFixture.rename(
                MarketplaceFixture.personaSubmission(),
                MarketplaceFixture.PERSONA_THUMBNAIL,
                NamePrefixMismatchReportsDifferentPrefixes.OTHER_PERSONA_THUMBNAIL
            ),
            contentType: "persona",
            expectedIds: ["ART/202"],
            expectedPaths: [NamePrefixMismatchReportsDifferentPrefixes.OTHER_PERSONA_THUMBNAIL],
        },
    ];

    static async run(entry: NamePrefixMismatchReportsDifferentPrefixesCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new NamePrefixMismatch(), entry);
    }
}

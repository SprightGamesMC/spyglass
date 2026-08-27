import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingPartnerArtMissingReportsAbsentPartnerArtCase } from "../Types/MarketingPartnerArtMissingReportsAbsentPartnerArtTypes.js";
import MarketingPartnerArtMissing from "../../src/Checks/Art/MarketingPartnerArtMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingPartnerArtMissingReportsAbsentPartnerArt {
    static readonly ID = "ART/104";
    static readonly CASES: readonly MarketingPartnerArtMissingReportsAbsentPartnerArtCase[] = [
        {
            name: "skin PartnerArt file in Marketing Art satisfies the partner art requirement",
            files: MarketplaceFixture.skinSubmission(),
            contentType: "skin",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "skin Marketing Art without a PartnerArt file lacks the required partner art",
            files: MarketplaceFixture.without(MarketplaceFixture.skinSubmission(), MarketplaceFixture.PARTNER_ART),
            contentType: "skin",
            expectedIds: ["ART/104"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: MarketingPartnerArtMissingReportsAbsentPartnerArtCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingPartnerArtMissing(), entry);
    }
}

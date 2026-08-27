import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MarketingKeyArtMissingReportsAbsentKeyArtCase } from "../Types/MarketingKeyArtMissingReportsAbsentKeyArtTypes.js";
import MarketingKeyArtMissing from "../../src/Checks/Art/MarketingKeyArtMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class MarketingKeyArtMissingReportsAbsentKeyArt {
    static readonly ID = "ART/103";
    static readonly CASES: readonly MarketingKeyArtMissingReportsAbsentKeyArtCase[] = [
        {
            name: "MarketingKeyArt file in Marketing Art satisfies the key art requirement",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "Marketing Art without a MarketingKeyArt file lacks the required key art",
            files: MarketplaceFixture.without(MarketplaceFixture.addonSubmission(), MarketplaceFixture.KEY_ART),
            expectedIds: ["ART/103"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: MarketingKeyArtMissingReportsAbsentKeyArtCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new MarketingKeyArtMissing(), entry);
    }
}

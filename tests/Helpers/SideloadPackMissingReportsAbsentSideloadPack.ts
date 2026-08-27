import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SideloadPackMissingReportsAbsentSideloadPackCase } from "../Types/SideloadPackMissingReportsAbsentSideloadPackTypes.js";
import SideloadPackMissing from "../../src/Checks/Art/SideloadPackMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class SideloadPackMissingReportsAbsentSideloadPack {
    static readonly ID = "ART/110";
    static readonly SIDELOAD_PACK = MarketplaceFixture.marketingPath(MarketplaceFixture.EMOTE_ID + "_SideLoad.mcpack");
    static readonly CASES: readonly SideloadPackMissingReportsAbsentSideloadPackCase[] = [
        {
            name: "emote SideLoad.mcpack in Marketing Art satisfies the sideload pack requirement",
            files: MarketplaceFixture.emoteSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "emote Marketing Art without a SideLoad.mcpack lacks the required sideload pack",
            files: MarketplaceFixture.without(
                MarketplaceFixture.emoteSubmission(),
                SideloadPackMissingReportsAbsentSideloadPack.SIDELOAD_PACK
            ),
            contentType: "persona",
            expectedIds: ["ART/110"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: SideloadPackMissingReportsAbsentSideloadPackCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new SideloadPackMissing(), entry);
    }
}

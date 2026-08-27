import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PackFolderNameInvalidReportsFolderWithoutPrefixCase } from "../Types/PackFolderNameInvalidReportsFolderWithoutPrefixTypes.js";
import PackFolderNameInvalid from "../../src/Checks/Marketplace/PackFolderNameInvalid.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class PackFolderNameInvalidReportsFolderWithoutPrefix {
    static readonly ID = "MARKETPLACE/201";
    static readonly UNPREFIXED_ROOT = "Content/behavior_packs/Behavior";
    static readonly MISPLACED_ROOT = "Content/packs/BP_TST";
    static readonly CASES: readonly PackFolderNameInvalidReportsFolderWithoutPrefixCase[] = [
        {
            name: "BP_TST and RP_TST folders follow the prefix and acronym form",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior_packs/Behavior folder lacks the BP_ prefix",
            files: MarketplaceFixture.renameFolder(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.BEHAVIOR_ROOT,
                PackFolderNameInvalidReportsFolderWithoutPrefix.UNPREFIXED_ROOT
            ),
            expectedIds: ["MARKETPLACE/201"],
            expectedPaths: [PackFolderNameInvalidReportsFolderWithoutPrefix.UNPREFIXED_ROOT],
        },
        {
            name: "Content/packs/BP_TST folder is not under behavior_packs",
            files: MarketplaceFixture.renameFolder(
                MarketplaceFixture.addonSubmission(),
                MarketplaceFixture.BEHAVIOR_ROOT,
                PackFolderNameInvalidReportsFolderWithoutPrefix.MISPLACED_ROOT
            ),
            expectedIds: ["MARKETPLACE/201"],
            expectedPaths: [PackFolderNameInvalidReportsFolderWithoutPrefix.MISPLACED_ROOT],
        },
    ];

    static async run(entry: PackFolderNameInvalidReportsFolderWithoutPrefixCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new PackFolderNameInvalid(), entry);
    }
}

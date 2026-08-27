import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BlockbenchProjectMissingReportsAbsentProjectFileCase } from "../Types/BlockbenchProjectMissingReportsAbsentProjectFileTypes.js";
import BlockbenchProjectMissing from "../../src/Checks/Art/BlockbenchProjectMissing.js";
import ArtLimits from "../../src/Checks/Art/ArtLimits.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class BlockbenchProjectMissingReportsAbsentProjectFile {
    static readonly ID = "ART/111";
    static readonly BLOCKBENCH_PROJECT = MarketplaceFixture.marketingPath(
        MarketplaceFixture.PIECE_ID + ArtLimits.BLOCKBENCH_PROJECT_SUFFIX + ".bbmodel"
    );
    static readonly CASES: readonly BlockbenchProjectMissingReportsAbsentProjectFileCase[] = [
        {
            name: "persona .bbmodel file in Marketing Art satisfies the model project requirement",
            files: MarketplaceFixture.personaSubmission(),
            contentType: "persona",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "persona Marketing Art without a .bbmodel file lacks the required model project",
            files: MarketplaceFixture.without(
                MarketplaceFixture.personaSubmission(),
                BlockbenchProjectMissingReportsAbsentProjectFile.BLOCKBENCH_PROJECT
            ),
            contentType: "persona",
            expectedIds: ["ART/111"],
            expectedPaths: [MarketplaceFixture.MARKETING_FOLDER],
        },
    ];

    static async run(entry: BlockbenchProjectMissingReportsAbsentProjectFileCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new BlockbenchProjectMissing(), entry);
    }
}

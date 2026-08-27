import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { WorldPackReferenceFileMissingReportsPackWithoutReferenceFileCase } from "../Types/WorldPackReferenceFileMissingReportsPackWithoutReferenceFileTypes.js";
import WorldPackReferenceFileMissing from "../../src/Checks/Marketplace/WorldPackReferenceFileMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class WorldPackReferenceFileMissingReportsPackWithoutReferenceFile {
    static readonly ID = "MARKETPLACE/106";
    static readonly CASES: readonly WorldPackReferenceFileMissingReportsPackWithoutReferenceFileCase[] = [
        {
            name: "world template with both pack reference files has a reference file for each pack",
            files: MarketplaceFixture.worldSubmission(),
            contentType: "world",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior pack without world_behavior_packs.json has no reference file",
            files: MarketplaceFixture.without(MarketplaceFixture.worldSubmission(), MarketplaceFixture.WORLD_BEHAVIOR_REFERENCES),
            contentType: "world",
            expectedIds: ["MARKETPLACE/106"],
            expectedPaths: [MarketplaceFixture.WORLD_BEHAVIOR_REFERENCES],
        },
    ];

    static async run(entry: WorldPackReferenceFileMissingReportsPackWithoutReferenceFileCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new WorldPackReferenceFileMissing(), entry);
    }
}

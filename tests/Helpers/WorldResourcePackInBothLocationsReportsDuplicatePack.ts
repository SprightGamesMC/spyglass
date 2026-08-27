import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { WorldResourcePackInBothLocationsReportsDuplicatePackCase } from "../Types/WorldResourcePackInBothLocationsReportsDuplicatePackTypes.js";
import WorldResourcePackInBothLocations from "../../src/Checks/Marketplace/WorldResourcePackInBothLocations.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class WorldResourcePackInBothLocationsReportsDuplicatePack {
    static readonly ID = "MARKETPLACE/205";
    static readonly CASES: readonly WorldResourcePackInBothLocationsReportsDuplicatePackCase[] = [
        {
            name: "world resource pack only under world_template/resource_packs is in one location",
            files: MarketplaceFixture.worldSubmission(),
            contentType: "world",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world resource pack under both Content/resource_packs and world_template/resource_packs is in two locations",
            files: {
                ...MarketplaceFixture.worldSubmission(),
                [MarketplaceFixture.RESOURCE_MANIFEST]: MarketplaceFixture.resourceManifest(),
            },
            contentType: "world",
            expectedIds: ["MARKETPLACE/205"],
            expectedPaths: [MarketplaceFixture.WORLD_RESOURCE_ROOT],
        },
    ];

    static async run(entry: WorldResourcePackInBothLocationsReportsDuplicatePackCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new WorldResourcePackInBothLocations(), entry);
    }
}

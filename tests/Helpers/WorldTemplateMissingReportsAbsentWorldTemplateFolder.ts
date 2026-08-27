import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { WorldTemplateMissingReportsAbsentWorldTemplateFolderCase } from "../Types/WorldTemplateMissingReportsAbsentWorldTemplateFolderTypes.js";
import WorldTemplateMissing from "../../src/Checks/Marketplace/WorldTemplateMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class WorldTemplateMissingReportsAbsentWorldTemplateFolder {
    static readonly ID = "MARKETPLACE/102";
    static readonly CASES: readonly WorldTemplateMissingReportsAbsentWorldTemplateFolderCase[] = [
        {
            name: "Content/world_template folder is present for world content",
            files: MarketplaceFixture.worldSubmission(),
            contentType: "world",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world content without Content/world_template lacks the world template folder",
            files: MarketplaceFixture.addonSubmission(),
            contentType: "world",
            expectedIds: ["MARKETPLACE/102"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: WorldTemplateMissingReportsAbsentWorldTemplateFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new WorldTemplateMissing(), entry);
    }
}

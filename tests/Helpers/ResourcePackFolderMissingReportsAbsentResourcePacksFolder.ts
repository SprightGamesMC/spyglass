import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ResourcePackFolderMissingReportsAbsentResourcePacksFolderCase } from "../Types/ResourcePackFolderMissingReportsAbsentResourcePacksFolderTypes.js";
import ResourcePackFolderMissing from "../../src/Checks/Marketplace/ResourcePackFolderMissing.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class ResourcePackFolderMissingReportsAbsentResourcePacksFolder {
    static readonly ID = "MARKETPLACE/104";
    static readonly CASES: readonly ResourcePackFolderMissingReportsAbsentResourcePacksFolderCase[] = [
        {
            name: "Content/resource_packs folder is present for texture content",
            files: MarketplaceFixture.addonSubmission(),
            contentType: "texture",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "texture content without Content/resource_packs lacks the resource pack folder",
            files: MarketplaceFixture.withoutFolder(MarketplaceFixture.addonSubmission(), "Content/resource_packs"),
            contentType: "texture",
            expectedIds: ["MARKETPLACE/104"],
            expectedPaths: [""],
        },
    ];

    static async run(entry: ResourcePackFolderMissingReportsAbsentResourcePacksFolderCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new ResourcePackFolderMissing(), entry);
    }
}

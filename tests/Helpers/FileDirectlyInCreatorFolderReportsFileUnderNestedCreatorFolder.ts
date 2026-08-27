import type { FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolderCase } from "../Types/FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolderTypes.js";
import FileDirectlyInCreatorFolder from "../../src/Checks/Addon/FileDirectlyInCreatorFolder.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolder {
    static readonly ID = "ADDON/202";
    static readonly CASES: readonly FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolderCase[] = [
        {
            name: "chest.json under a project folder below the creator folder is not directly in the creator folder",
            packType: "behavior",
            paths: ["loot_tables/spright/cave/chest.json"],
            expectedPaths: [],
        },
        {
            name: "chest.json directly in flat folder spright_cave is not checked because the flat layout has no creator folder",
            packType: "behavior",
            paths: ["loot_tables/spright_cave/chest.json"],
            expectedPaths: [],
        },
        {
            name: "chest.json directly in creator folder spright is a file directly in a creator folder",
            packType: "behavior",
            paths: ["loot_tables/spright/chest.json"],
            expectedPaths: [AddonFixture.BP + "loot_tables/spright/chest.json"],
        },
    ];

    static async run(entry: FileDirectlyInCreatorFolderReportsFileUnderNestedCreatorFolderCase): Promise<string[]> {
        const summary = await AddonFixture.run(new FileDirectlyInCreatorFolder(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}

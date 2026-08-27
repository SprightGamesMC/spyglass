import type { FileDirectlyInTypeFolderReportsFileUnderTypeFolderCase } from "../Types/FileDirectlyInTypeFolderReportsFileUnderTypeFolderTypes.js";
import FileDirectlyInTypeFolder from "../../src/Checks/Addon/FileDirectlyInTypeFolder.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class FileDirectlyInTypeFolderReportsFileUnderTypeFolder {
    static readonly ID = "ADDON/201";
    static readonly CASES: readonly FileDirectlyInTypeFolderReportsFileUnderTypeFolderCase[] = [
        {
            name: "functions under creator and project folders and the tick.json catalog file are not directly in the type folder",
            packType: "behavior",
            paths: ["functions/spright/cave/hello.mcfunction", "functions/spright/common/shared.mcfunction", "functions/tick.json"],
            expectedPaths: [],
        },
        {
            name: "loot tables under a spright_cave folder are not directly in the type folder",
            packType: "behavior",
            paths: ["loot_tables/spright_cave/chest.json", "loot_tables/spright_cave/deeper/chest.json"],
            expectedPaths: [],
        },
        {
            name: "entities, items, and biomes are unscanned type folders",
            packType: "behavior",
            paths: ["entities/cow.json", "items/sword.json", "biomes/desert.json"],
            expectedPaths: [],
        },
        {
            name: "chest.json directly in loot_tables is a file directly in a type folder",
            packType: "behavior",
            paths: ["loot_tables/chest.json"],
            expectedPaths: [AddonFixture.BP + "loot_tables/chest.json"],
        },
        {
            name: "texture directly in the textures folder of a subpack is a file directly in a type folder",
            packType: "resource",
            paths: ["subpacks/tier2/textures/a.png"],
            expectedPaths: [AddonFixture.RP + "subpacks/tier2/textures/a.png"],
        },
    ];

    static async run(entry: FileDirectlyInTypeFolderReportsFileUnderTypeFolderCase): Promise<string[]> {
        const summary = await AddonFixture.run(new FileDirectlyInTypeFolder(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}

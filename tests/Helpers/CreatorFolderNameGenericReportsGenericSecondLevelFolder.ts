import type { CreatorFolderNameGenericReportsGenericSecondLevelFolderCase } from "../Types/CreatorFolderNameGenericReportsGenericSecondLevelFolderTypes.js";
import CreatorFolderNameGeneric from "../../src/Checks/Addon/CreatorFolderNameGeneric.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class CreatorFolderNameGenericReportsGenericSecondLevelFolder {
    static readonly ID = "ADDON/203";
    static readonly CASES: readonly CreatorFolderNameGenericReportsGenericSecondLevelFolderCase[] = [
        {
            name: "spright creator folder is not a generic term",
            packType: "resource",
            paths: ["textures/spright/cave/a.png"],
            expectedPaths: [],
        },
        {
            name: "lighting, fog, and biome folders are found by identifier so they are not scanned",
            packType: "resource",
            paths: ["local_lighting/local_lighting.json", "lighting/desert_lighting.json", "fogs/desert.fog.json", "biomes/desert.json"],
            expectedPaths: [],
        },
        {
            name: "mobs and mobs_cave are generic creator folder names",
            packType: "resource",
            paths: ["textures/mobs/cave/a.png", "textures/mobs_cave/b.png", "textures/terrain_texture.json"],
            expectedPaths: [AddonFixture.RP + "textures/mobs", AddonFixture.RP + "textures/mobs_cave"],
        },
    ];

    static async run(entry: CreatorFolderNameGenericReportsGenericSecondLevelFolderCase): Promise<string[]> {
        const summary = await AddonFixture.run(new CreatorFolderNameGeneric(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}

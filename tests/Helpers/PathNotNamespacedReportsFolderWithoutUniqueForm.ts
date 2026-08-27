import type { PathNotNamespacedReportsFolderWithoutUniqueFormCase } from "../Types/PathNotNamespacedReportsFolderWithoutUniqueFormTypes.js";
import PathNotNamespaced from "../../src/Checks/Addon/PathNotNamespaced.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class PathNotNamespacedReportsFolderWithoutUniqueForm {
    static readonly ID = "ADDON/211";
    static readonly CASES: readonly PathNotNamespacedReportsFolderWithoutUniqueFormCase[] = [
        {
            name: "spright_cave folders under functions, trading, and trade_tables are in unique form",
            packType: "behavior",
            paths: ["functions/spright_cave/a.mcfunction", "trading/spright_cave/trader.json", "trade_tables/spright_cave/trader.json"],
            expectedPaths: [],
        },
        {
            name: "spright creator folder holding a cave project folder is the nested layout",
            packType: "behavior",
            paths: ["functions/spright/cave/a.mcfunction", "loot_tables/spright/cave/a.json"],
            expectedPaths: [],
        },
        {
            name: "chests loot table folder is a generic term so it is a type folder and not a creator short name",
            packType: "behavior",
            paths: ["loot_tables/chests/cave/a.json"],
            expectedPaths: [AddonFixture.BP + "loot_tables/chests"],
        },
        {
            name: "spright function folder holding only files is not the nested layout because it has no project folder",
            packType: "behavior",
            paths: ["functions/spright/a.mcfunction"],
            expectedPaths: [AddonFixture.BP + "functions/spright"],
        },
        {
            name: "spright_cave folders under textures, sounds, and structures are in unique form",
            packType: "resource",
            paths: ["textures/spright_cave/a.png", "sounds/spright_cave/a.ogg", "structures/spright_cave/a.mcstructure"],
            expectedPaths: [],
        },
        {
            name: "xp creator folder holding a cave project folder is the nested layout under textures and sounds",
            packType: "resource",
            paths: ["textures/xp/cave/a.png", "sounds/xp/cave/a.ogg"],
            expectedPaths: [],
        },
        {
            name: "cave structure folder is not in unique form because structures takes the flat layout only",
            packType: "resource",
            paths: ["structures/cave/deep/a.mcstructure"],
            expectedPaths: [AddonFixture.RP + "structures/cave"],
        },
        {
            name: "blocks texture folder is a generic term so a stone subfolder does not make it the nested layout",
            packType: "resource",
            paths: ["textures/blocks/stone/a.png"],
            expectedPaths: [AddonFixture.RP + "textures/blocks"],
        },
        {
            name: "spright_cave folder inside a subpack is in unique form",
            packType: "resource",
            paths: ["subpacks/tier2/textures/spright_cave/a.png"],
            expectedPaths: [],
        },
        {
            name: "blocks texture folder inside a subpack is a generic term and is not namespaced",
            packType: "resource",
            paths: ["subpacks/tier2/textures/blocks/stone/a.png"],
            expectedPaths: [AddonFixture.RP + "subpacks/tier2/textures/blocks"],
        },
    ];

    static async run(entry: PathNotNamespacedReportsFolderWithoutUniqueFormCase): Promise<string[]> {
        const summary = await AddonFixture.run(new PathNotNamespaced(), AddonFixture.packPathFiles(entry));

        return summary.paths;
    }
}

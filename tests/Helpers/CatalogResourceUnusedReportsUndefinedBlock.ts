import type { Finding } from "../../src/Types/CheckTypes.js";
import type { CatalogResourceUnusedReportsUndefinedBlockCase } from "../Types/CatalogResourceUnusedReportsUndefinedBlockTypes.js";
import CatalogResourceUnused from "../../src/Checks/Block/CatalogResourceUnused.js";
import BlockCatalogFixture from "./Core/BlockCatalogFixture.js";

export default abstract class CatalogResourceUnusedReportsUndefinedBlock {
    static readonly ID = "BLOCK/301";
    static readonly CATALOG_PATH = BlockCatalogFixture.CATALOG_PATH;
    static readonly CASES: readonly CatalogResourceUnusedReportsUndefinedBlockCase[] = [
        {
            name: "entries x:one and two each match a defined block",
            catalog: { format_version: "1.21.40", "x:one": { textures: "one" }, two: { sound: "stone" } },
            definedBlocks: ["x:one", "x:two"],
            expectedKeys: [],
        },
        {
            name: "entry x:three with no textures or sound is not a resource entry",
            catalog: { "x:three": { isotropic: true } },
            definedBlocks: [],
            expectedKeys: [],
        },
        {
            name: "entries stone and minecraft:dirt are vanilla block names",
            catalog: { stone: { textures: "stone" }, "minecraft:dirt": { textures: "dirt" } },
            definedBlocks: [],
            expectedKeys: [],
        },
        {
            name: "entries x:gone and y:missing match no defined block",
            catalog: { "x:gone": { textures: "gone" }, "y:missing": { carried_textures: "m" } },
            definedBlocks: ["x:one"],
            expectedKeys: ["x:gone", "y:missing"],
        },
        {
            name: "entry minecraft:not_real is not a vanilla block name and matches no defined block",
            catalog: { "minecraft:not_real": { textures: "n" } },
            definedBlocks: [],
            expectedKeys: ["minecraft:not_real"],
        },
    ];

    static run(entry: CatalogResourceUnusedReportsUndefinedBlockCase): Promise<Finding[]> {
        return BlockCatalogFixture.run(new CatalogResourceUnused(), entry);
    }
}

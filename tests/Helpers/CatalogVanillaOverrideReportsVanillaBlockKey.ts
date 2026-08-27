import type { Finding } from "../../src/Types/CheckTypes.js";
import type { CatalogVanillaOverrideReportsVanillaBlockKeyCase } from "../Types/CatalogVanillaOverrideReportsVanillaBlockKeyTypes.js";
import CatalogVanillaOverride from "../../src/Checks/Block/CatalogVanillaOverride.js";
import BlockCatalogFixture from "./Core/BlockCatalogFixture.js";

export default abstract class CatalogVanillaOverrideReportsVanillaBlockKey {
    static readonly ID = "BLOCK/601";
    static readonly CATALOG_PATH = BlockCatalogFixture.CATALOG_PATH;
    static readonly CASES: readonly CatalogVanillaOverrideReportsVanillaBlockKeyCase[] = [
        {
            name: "entry x:one matches a defined block",
            catalog: { "x:one": { textures: "one" } },
            definedBlocks: ["x:one"],
            expectedKeys: [],
        },
        {
            name: "entry stone matches the defined block x:stone without its namespace",
            catalog: { stone: { textures: "stone" } },
            definedBlocks: ["x:stone"],
            expectedKeys: [],
        },
        {
            name: "entry minecraft:not_real is not a vanilla block name",
            catalog: { "minecraft:not_real": { textures: "n" } },
            definedBlocks: [],
            expectedKeys: [],
        },
        {
            name: "entries stone and minecraft:dirt are vanilla block names with no defined block",
            catalog: { stone: { textures: "stone" }, "minecraft:dirt": { textures: "dirt" } },
            definedBlocks: [],
            expectedKeys: ["minecraft:dirt", "stone"],
        },
    ];

    static run(entry: CatalogVanillaOverrideReportsVanillaBlockKeyCase): Promise<Finding[]> {
        return BlockCatalogFixture.run(new CatalogVanillaOverride(), entry);
    }
}

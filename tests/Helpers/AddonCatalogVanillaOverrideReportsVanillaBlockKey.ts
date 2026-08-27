import type { Finding } from "../../src/Types/CheckTypes.js";
import type { AddonCatalogVanillaOverrideReportsVanillaBlockKeyCase } from "../Types/AddonCatalogVanillaOverrideReportsVanillaBlockKeyTypes.js";
import BlockCatalogVanillaOverride from "../../src/Checks/Block/CatalogVanillaOverride.js";
import CatalogVanillaOverride from "../../src/Checks/Addon/CatalogVanillaOverride.js";
import BlockCatalogFixture from "./Core/BlockCatalogFixture.js";

export default abstract class AddonCatalogVanillaOverrideReportsVanillaBlockKey {
    static readonly ID = "ADDON/705";
    static readonly CATALOG_PATH = BlockCatalogFixture.CATALOG_PATH;
    static readonly CASES: readonly AddonCatalogVanillaOverrideReportsVanillaBlockKeyCase[] = [
        {
            name: "entry x:one matches a defined block",
            catalog: { "x:one": { textures: "one" } },
            definedBlocks: ["x:one"],
            expectedKeys: [],
        },
        {
            name: "entries stone and minecraft:dirt are vanilla block names with no defined block",
            catalog: { stone: { textures: "stone" }, "minecraft:dirt": { textures: "dirt" } },
            definedBlocks: [],
            expectedKeys: ["minecraft:dirt", "stone"],
        },
    ];

    static blockGroupExcludedContentTypes(): readonly string[] {
        return new BlockCatalogVanillaOverride().definition.excludedContentTypes ?? [];
    }

    static run(entry: AddonCatalogVanillaOverrideReportsVanillaBlockKeyCase): Promise<Finding[]> {
        return BlockCatalogFixture.run(new CatalogVanillaOverride(), entry);
    }
}

import type { CatalogKeyNotNamespacedReportsUnprefixedKeyCase } from "../Types/CatalogKeyNotNamespacedReportsUnprefixedKeyTypes.js";
import CatalogKeyNotNamespaced from "../../src/Checks/Addon/CatalogKeyNotNamespaced.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class CatalogKeyNotNamespacedReportsUnprefixedKey {
    static readonly ID = "ADDON/210";
    static readonly CASES: readonly CatalogKeyNotNamespacedReportsUnprefixedKeyCase[] = [
        {
            name: "sound definition spright_cave:drip has a two token namespace",
            path: AddonFixture.RP + "sounds/sound_definitions.json",
            content: { format_version: "1.14.0", sound_definitions: { "spright_cave:drip": {} } },
            expectedFields: [],
        },
        {
            name: "sound definition mob.cow.say has no namespace before a colon",
            path: AddonFixture.RP + "sounds/sound_definitions.json",
            content: { format_version: "1.14.0", sound_definitions: { "mob.cow.say": {} } },
            expectedFields: ["sound_definitions.mob.cow.say"],
        },
        {
            name: "legacy root level key spright_cave:drip is namespaced and format_version is not read as a key",
            path: AddonFixture.RP + "sounds/sound_definitions.json",
            content: { format_version: "1.10.0", "spright_cave:drip": {} },
            expectedFields: [],
        },
        {
            name: "terrain texture key stone has no namespace",
            path: AddonFixture.RP + "textures/terrain_texture.json",
            content: { texture_data: { stone: {}, "spright_cave:ore": {} } },
            expectedFields: ["texture_data.stone"],
        },
        {
            name: "item texture key spright_cave_gem uses the underscore form",
            path: AddonFixture.RP + "textures/item_texture.json",
            content: { texture_data: { spright_cave_gem: {} } },
            expectedFields: [],
        },
        {
            name: "item texture key spright_cave.gem has only two underscore tokens",
            path: AddonFixture.RP + "textures/item_texture.json",
            content: { texture_data: { "spright_cave.gem": {} } },
            expectedFields: ["texture_data.spright_cave.gem"],
        },
        {
            name: "item texture key gem has no namespace",
            path: AddonFixture.RP + "textures/item_texture.json",
            content: { texture_data: { gem: {} } },
            expectedFields: ["texture_data.gem"],
        },
        {
            name: "flipbook atlas tile lava has no namespace",
            path: AddonFixture.RP + "textures/flipbook_textures.json",
            content: [{ atlas_tile: "spright_cave:lava" }, { atlas_tile: "lava" }],
            expectedFields: ["[1].atlas_tile"],
        },
        {
            name: "crafting catalog group gems has no namespace",
            path: AddonFixture.BP + "item_catalog/crafting_item_catalog.json",
            content: {
                "minecraft:crafting_items_catalog": {
                    categories: [{ groups: [{ group_identifier: { name: "spright_cave:gems" } }, { group_identifier: { name: "gems" } }] }],
                },
            },
            expectedFields: ["categories[0].groups[1].group_identifier.name"],
        },
    ];

    static async run(entry: CatalogKeyNotNamespacedReportsUnprefixedKeyCase): Promise<string[]> {
        const summary = await AddonFixture.run(new CatalogKeyNotNamespaced(), AddonFixture.pairFiles({ [entry.path]: entry.content }));

        return summary.fields;
    }
}

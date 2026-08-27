import type { DefinitionIdentifierNotNamespacedReportsVanillaNamespaceCase } from "../Types/DefinitionIdentifierNotNamespacedReportsVanillaNamespaceTypes.js";
import DefinitionIdentifierNotNamespaced from "../../src/Checks/Addon/DefinitionIdentifierNotNamespaced.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class DefinitionIdentifierNotNamespacedReportsVanillaNamespace {
    static readonly ID = "ADDON/207";
    static readonly CASES: readonly DefinitionIdentifierNotNamespacedReportsVanillaNamespaceCase[] = [
        {
            name: "entity identifier spright_cave:cow has a two token namespace",
            path: AddonFixture.BP + "entities/cow.json",
            content: { "minecraft:entity": { description: { identifier: "spright_cave:cow" } } },
            expectedFields: [],
        },
        {
            name: "entity identifier minecraft:cow has a single token namespace",
            path: AddonFixture.BP + "entities/cow.json",
            content: { "minecraft:entity": { description: { identifier: "minecraft:cow" } } },
            expectedFields: ["minecraft:entity.description.identifier"],
        },
        {
            name: "recipe identifier cake has no namespace",
            path: AddonFixture.BP + "recipes/cake.json",
            content: { "minecraft:recipe_shaped": { description: { identifier: "cake" } } },
            expectedFields: ["minecraft:recipe_shaped.description.identifier"],
        },
        {
            name: "camera preset identifier cam:top has a single token namespace",
            path: AddonFixture.BP + "cameras/presets/top.json",
            content: { "minecraft:camera_preset": { identifier: "cam:top" } },
            expectedFields: ["minecraft:camera_preset.identifier"],
        },
        {
            name: "aim assist category name bad has no namespace while spright_cave:ok does",
            path: AddonFixture.BP + "aim_assist/categories/categories.json",
            content: { "minecraft:aim_assist_categories": { categories: [{ name: "spright_cave:ok" }, { name: "bad" }] } },
            expectedFields: ["minecraft:aim_assist_categories.categories[1].name"],
        },
        {
            name: "attachable identifier spright_cave:hat has a two token namespace",
            path: AddonFixture.RP + "attachables/hat.json",
            content: { "minecraft:attachable": { description: { identifier: "spright_cave:hat" } } },
            expectedFields: [],
        },
    ];

    static async run(entry: DefinitionIdentifierNotNamespacedReportsVanillaNamespaceCase): Promise<string[]> {
        const summary = await AddonFixture.run(
            new DefinitionIdentifierNotNamespaced(),
            AddonFixture.pairFiles({ [entry.path]: entry.content })
        );

        return summary.fields;
    }
}

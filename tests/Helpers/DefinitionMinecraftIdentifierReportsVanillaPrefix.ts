import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DefinitionMinecraftIdentifierReportsVanillaPrefixCase } from "../Types/DefinitionMinecraftIdentifierReportsVanillaPrefixTypes.js";
import MinecraftIdentifier from "../../src/Checks/Definition/MinecraftIdentifier.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class DefinitionMinecraftIdentifierReportsVanillaPrefix {
    static readonly ID = "DEFINITION/601";
    static readonly CASES: readonly DefinitionMinecraftIdentifierReportsVanillaPrefixCase[] = [
        {
            name: "entity identifier x:thing uses a custom namespace",
            path: "BP/entities/thing.json",
            rootKey: "minecraft:entity",
            description: { identifier: "x:thing", runtime_identifier: "minecraft:zombie" },
            expectFinding: false,
        },
        {
            name: "entity identifier minecraft:zombie uses the minecraft prefix",
            path: "BP/entities/thing.json",
            rootKey: "minecraft:entity",
            description: { identifier: "minecraft:zombie" },
            expectFinding: true,
        },
        {
            name: "entity identifier MINECRAFT:zombie matches the minecraft prefix case insensitively",
            path: "BP/entities/thing.json",
            rootKey: "minecraft:entity",
            description: { identifier: "MINECRAFT:zombie" },
            expectFinding: true,
        },
        {
            name: "item identifier x:thing uses a custom namespace",
            path: "BP/items/thing.json",
            rootKey: "minecraft:item",
            description: { identifier: "x:thing" },
            expectFinding: false,
        },
        {
            name: "item identifier minecraft:apple uses the minecraft prefix",
            path: "BP/items/thing.json",
            rootKey: "minecraft:item",
            description: { identifier: "minecraft:apple" },
            expectFinding: true,
        },
        {
            name: "block identifier minecraft:stone uses the minecraft prefix",
            path: "BP/blocks/thing.json",
            rootKey: "minecraft:block",
            description: { identifier: "minecraft:stone" },
            expectFinding: true,
        },
        {
            name: "shapeless recipe identifier minecraft:bread uses the minecraft prefix under its own root key",
            path: "BP/recipes/thing.json",
            rootKey: "minecraft:recipe_shapeless",
            description: { identifier: "minecraft:bread" },
            expectFinding: true,
        },
        {
            name: "ore feature identifier minecraft:coal_ore uses the minecraft prefix under its own root key",
            path: "BP/features/thing.json",
            rootKey: "minecraft:ore_feature",
            description: { identifier: "minecraft:coal_ore" },
            expectFinding: true,
        },
        {
            name: "spawn rule identifier minecraft:zombie uses the minecraft prefix",
            path: "BP/spawn_rules/thing.json",
            rootKey: "minecraft:spawn_rules",
            description: { identifier: "minecraft:zombie" },
            expectFinding: true,
        },
        {
            name: "recipe without a description has no identifier to check",
            path: "BP/recipes/thing.json",
            rootKey: "minecraft:recipe_furnace",
            description: {},
            expectFinding: false,
        },
        {
            name: "attachable identifier minecraft:diamond_helmet is a resource pack override and is not checked",
            path: "RP/attachables/thing.json",
            rootKey: "minecraft:attachable",
            description: { identifier: "minecraft:diamond_helmet" },
            expectFinding: false,
        },
    ];

    static excludedContentTypes(): readonly string[] | undefined {
        return new MinecraftIdentifier().definition.excludedContentTypes;
    }

    static run(entry: DefinitionMinecraftIdentifierReportsVanillaPrefixCase): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [entry.path]: { format_version: ModelFixture.DEFAULT_GAME_VERSION, [entry.rootKey]: { description: entry.description } },
        };

        return ModelFixture.findings(new MinecraftIdentifier(), files);
    }
}

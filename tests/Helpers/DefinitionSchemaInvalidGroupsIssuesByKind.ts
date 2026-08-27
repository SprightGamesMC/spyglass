import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DefinitionSchemaCase } from "../Types/DefinitionSchemaInvalidGroupsIssuesByKindTypes.js";
import SchemaInvalid from "../../src/Checks/Definition/SchemaInvalid.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class DefinitionSchemaInvalidGroupsIssuesByKind {
    static readonly ID = "DEFINITION/201";
    static readonly CASES: readonly DefinitionSchemaCase[] = [
        {
            name: "entity with identifier components groups and events at the current release matches the schema",
            path: "BP/entities/a.json",
            content: {
                format_version: ModelFixture.DEFAULT_GAME_VERSION,
                "minecraft:entity": { description: { identifier: "x:thing" }, components: {}, component_groups: {}, events: {} },
            },
            expectedMessages: [],
        },
        {
            name: "entity at format_version 1.20.0 is not the current release so the schema is not checked",
            path: "BP/entities/a.json",
            content: { format_version: "1.20.0", "minecraft:entity": { description: {}, components: "no" } },
            expectedMessages: [],
        },
        {
            name: "entity missing identifier with wrong typed components and events and extra root keys groups issues by kind",
            path: "BP/entities/a.json",
            content: {
                format_version: ModelFixture.DEFAULT_GAME_VERSION,
                "minecraft:entity": { description: {}, components: "no", events: [] },
                extra: 1,
                other: 2,
            },
            expectedMessages: [
                "1 missing required field issue: minecraft:entity.description.identifier",
                "2 wrong value type issues: minecraft:entity.components, minecraft:entity.events",
                "2 other structure issues: extra, other",
            ],
        },
        {
            name: "item at the current release without identifier lacks a required field",
            path: "BP/items/a.json",
            content: { format_version: ModelFixture.DEFAULT_GAME_VERSION, "minecraft:item": { description: {}, components: {} } },
            expectedMessages: ["1 missing required field issue: minecraft:item.description.identifier"],
        },
        {
            name: "block at the current release without identifier lacks a required field",
            path: "BP/blocks/a.json",
            content: { format_version: ModelFixture.DEFAULT_GAME_VERSION, "minecraft:block": { description: {}, components: {} } },
            expectedMessages: ["1 missing required field issue: minecraft:block.description.identifier"],
        },
        {
            name: "shapeless recipe with identifier and tags matches the schema",
            path: "BP/recipes/a.json",
            content: {
                format_version: "1.20.0",
                "minecraft:recipe_shapeless": { description: { identifier: "x:a" }, tags: ["crafting_table"] },
            },
            expectedMessages: [],
        },
        {
            name: "ore feature with format_version 1.13.0 matches the schema",
            path: "BP/features/a.json",
            content: { format_version: "1.13.0", "minecraft:ore_feature": { description: { identifier: "x:a" } } },
            expectedMessages: [],
        },
        {
            name: "snap to surface feature with feature_to_snap matches the schema",
            path: "BP/features/b.json",
            content: {
                format_version: "1.13.0",
                "minecraft:snap_to_surface_feature": { description: { identifier: "x:b" }, feature_to_snap: "x:a" },
            },
            expectedMessages: [],
        },
        {
            name: "minecraft:made_up_feature is a root key no schema knows",
            path: "BP/features/c.json",
            content: { format_version: "1.13.0", "minecraft:made_up_feature": { description: { identifier: "x:c" } } },
            expectedMessages: ["1 unknown definition type issue: minecraft:made_up_feature"],
        },
        {
            name: "client biome with identifier and components matches the schema",
            path: "RP/biomes/a.json",
            content: { format_version: "1.21.40", "minecraft:client_biome": { description: { identifier: "x:a" }, components: {} } },
            expectedMessages: [],
        },
        {
            name: "spawn rule with numeric format_version, object conditions, and no identifier groups issues by kind",
            path: "BP/spawn_rules/a.json",
            content: { format_version: 1, "minecraft:spawn_rules": { description: {}, conditions: {} } },
            expectedMessages: [
                "2 wrong value type issues: format_version, minecraft:spawn_rules.conditions",
                "1 missing required field issue: minecraft:spawn_rules.description.identifier",
            ],
        },
        {
            name: "feature rule without places_feature lacks a required field",
            path: "BP/feature_rules/a.json",
            content: { format_version: "1.13.0", "minecraft:feature_rules": { description: { identifier: "x:a" } } },
            expectedMessages: ["1 missing required field issue: minecraft:feature_rules.description.places_feature"],
        },
        {
            name: "fog with an unknown top level key extra does not match the structure",
            path: "RP/fogs/a.json",
            content: { format_version: "1.16.100", "minecraft:fog_settings": { description: { identifier: "x:a" } }, extra: true },
            expectedMessages: ["1 other structure issue: extra"],
        },
    ];

    static run(entry: DefinitionSchemaCase): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [entry.path]: entry.content,
        };

        return ModelFixture.findings(new SchemaInvalid(), files);
    }
}

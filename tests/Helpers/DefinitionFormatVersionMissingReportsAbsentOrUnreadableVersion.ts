import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DefinitionFormatVersionMissingCase } from "../Types/DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersionTypes.js";
import FormatVersionMissing from "../../src/Checks/Definition/FormatVersionMissing.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class DefinitionFormatVersionMissingReportsAbsentOrUnreadableVersion {
    static readonly ID = "DEFINITION/101";
    static readonly CASES: readonly DefinitionFormatVersionMissingCase[] = [
        {
            name: "recipe with format_version at the current game version has a version",
            path: "BP/recipes/a.json",
            content: { format_version: ModelFixture.DEFAULT_GAME_VERSION, "minecraft:recipe_shaped": {} },
            expectFinding: false,
        },
        {
            name: "particle with format_version array [1, 20, 80] has a parseable version",
            path: "RP/particles/smoke.json",
            content: { format_version: [1, 20, 80], particle_effect: { description: { identifier: "demo:smoke" } } },
            expectFinding: false,
        },
        {
            name: "client biome with format_version at the current game version has a version",
            path: "RP/biomes/a.json",
            content: { format_version: ModelFixture.DEFAULT_GAME_VERSION, "minecraft:client_biome": {} },
            expectFinding: false,
        },
        {
            name: "biome with no format_version has no version",
            path: "BP/biomes/a.json",
            content: { "minecraft:biome": {} },
            expectFinding: true,
        },
        {
            name: "feature rule with no format_version has no version",
            path: "BP/feature_rules/a.json",
            content: { "minecraft:feature_rules": {} },
            expectFinding: true,
        },
        {
            name: "render controller with no format_version has no version",
            path: "RP/render_controllers/a.json",
            content: { render_controllers: {} },
            expectFinding: true,
        },
        {
            name: "texture set with no format_version has no version",
            path: "RP/textures/blocks/a.texture_set.json",
            content: { "minecraft:texture_set": {} },
            expectFinding: true,
        },
        {
            name: "resource entity with no format_version has no version",
            path: "RP/entity/a.json",
            content: { "minecraft:client_entity": {} },
            expectFinding: true,
        },
        {
            name: "geometry with no format_version has no version",
            path: "RP/models/a.geo.json",
            content: { "minecraft:geometry": [] },
            expectFinding: true,
        },
        {
            name: "entity with no format_version has no version",
            path: "BP/entities/a.json",
            content: { "minecraft:entity": {} },
            expectFinding: true,
        },
        {
            name: "item with no format_version has no version",
            path: "BP/items/a.json",
            content: { "minecraft:item": {} },
            expectFinding: true,
        },
        {
            name: "block with no format_version has no version",
            path: "BP/blocks/a.json",
            content: { "minecraft:block": {} },
            expectFinding: true,
        },
        {
            name: "resource animation controller with no format_version has no version",
            path: "RP/animation_controllers/a.json",
            content: { animation_controllers: {} },
            expectFinding: true,
        },
        {
            name: "behavior animation with no format_version has no version",
            path: "BP/animations/a.json",
            content: { animations: {} },
            expectFinding: true,
        },
        {
            name: "attachable with no format_version has no version",
            path: "RP/attachables/a.json",
            content: { "minecraft:attachable": {} },
            expectFinding: true,
        },
        {
            name: "particle with format_version latest has no parseable version",
            path: "RP/particles/smoke.json",
            content: { format_version: "latest", particle_effect: {} },
            expectFinding: true,
        },
        {
            name: "spawn rule with no format_version has no version",
            path: "BP/spawn_rules/a.json",
            content: { "minecraft:spawn_rules": {} },
            expectFinding: true,
        },
        {
            name: "fog with no format_version has no version",
            path: "RP/fogs/a.json",
            content: { "minecraft:fog_settings": {} },
            expectFinding: true,
        },
        {
            name: "recipe with format_version true has no parseable version",
            path: "BP/recipes/a.json",
            content: { format_version: true, "minecraft:recipe_shaped": {} },
            expectFinding: true,
        },
        {
            name: "entity file that does not parse is skipped",
            path: "BP/entities/a.json",
            content: "{",
            expectFinding: false,
        },
    ];

    static run(entry: DefinitionFormatVersionMissingCase): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [entry.path]: entry.content,
        };

        return ModelFixture.findings(new FormatVersionMissing(), files);
    }
}

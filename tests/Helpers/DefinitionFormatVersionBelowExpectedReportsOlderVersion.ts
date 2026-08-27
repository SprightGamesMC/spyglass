import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DefinitionFormatVersionBelowExpectedReportsOlderVersionCase } from "../Types/DefinitionFormatVersionBelowExpectedReportsOlderVersionTypes.js";
import FormatVersionBelowExpected from "../../src/Checks/Definition/FormatVersionBelowExpected.js";
import FormatVersionFixture from "./Core/FormatVersionFixture.js";

export default abstract class DefinitionFormatVersionBelowExpectedReportsOlderVersion {
    static readonly ID = "DEFINITION/501";
    static readonly CASES: readonly DefinitionFormatVersionBelowExpectedReportsOlderVersionCase[] = [
        {
            name: "entity 10.30.20 equals the current release",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "entity 10.29.0 is the previous minor which is allowed",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "10.29.0",
            expectFinding: false,
        },
        {
            name: "entity 0.30.20 has a lower major than the current release",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "0.30.20",
            expectFinding: true,
        },
        {
            name: "item 10.30.10 has a lower patch than the current release",
            path: "BP/items/a.json",
            rootKey: "minecraft:item",
            formatVersion: "10.30.10",
            expectFinding: true,
        },
        {
            name: "block 10.20.0 is more than one minor below the current release",
            path: "BP/blocks/a.json",
            rootKey: "minecraft:block",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
        {
            name: "recipe 10.20.0 is more than one minor below the current release",
            path: "BP/recipes/a.json",
            rootKey: "minecraft:recipe_shaped",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
        {
            name: "fog 10.28.40 equals the version read from vanilla data",
            path: "RP/fogs/a.json",
            rootKey: "minecraft:fog_settings",
            formatVersion: "10.28.40",
            expectFinding: false,
        },
        {
            name: "fog 10.30.20 is the current release which is above the version read from vanilla data",
            path: "RP/fogs/a.json",
            rootKey: "minecraft:fog_settings",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "fog 10.28.10 has a lower patch than the version read from vanilla data",
            path: "RP/fogs/a.json",
            rootKey: "minecraft:fog_settings",
            formatVersion: "10.28.10",
            expectFinding: true,
        },
        {
            name: "fog 10.16.100 is more than one minor below the version read from vanilla data",
            path: "RP/fogs/a.json",
            rootKey: "minecraft:fog_settings",
            formatVersion: "10.16.100",
            expectFinding: true,
        },
        {
            name: "render controller 10.28.40 equals the version read from vanilla data",
            path: "RP/render_controllers/a.json",
            rootKey: "render_controllers",
            formatVersion: "10.28.40",
            expectFinding: false,
        },
        {
            name: "render controller 10.20.0 is more than one minor below the version read from vanilla data",
            path: "RP/render_controllers/a.json",
            rootKey: "render_controllers",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
        {
            name: "texture set 10.28.40 equals the version read from vanilla data",
            path: "RP/textures/blocks/a.texture_set.json",
            rootKey: "minecraft:texture_set",
            formatVersion: "10.28.40",
            expectFinding: false,
        },
        {
            name: "texture set 10.20.0 is more than one minor below the version read from vanilla data",
            path: "RP/textures/blocks/a.texture_set.json",
            rootKey: "minecraft:texture_set",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
        {
            name: "spawn rule 10.28.40 equals the version read from vanilla data",
            path: "BP/spawn_rules/a.json",
            rootKey: "minecraft:spawn_rules",
            formatVersion: "10.28.40",
            expectFinding: false,
        },
        {
            name: "spawn rule 10.27.0 is the previous minor of the version read from vanilla data",
            path: "BP/spawn_rules/a.json",
            rootKey: "minecraft:spawn_rules",
            formatVersion: "10.27.0",
            expectFinding: false,
        },
        {
            name: "spawn rule 1.8.0 is more than one minor below the version read from vanilla data",
            path: "BP/spawn_rules/a.json",
            rootKey: "minecraft:spawn_rules",
            formatVersion: "1.8.0",
            expectFinding: true,
        },
        {
            name: "resource animation 1.10.0 equals the exact expected version",
            path: "RP/animations/walk.json",
            rootKey: "animations",
            formatVersion: "1.10.0",
            expectFinding: false,
        },
        {
            name: "behavior animation controller 1.9.0 is one minor below the exact 1.10.0",
            path: "BP/animation_controllers/ai.json",
            rootKey: "animation_controllers",
            formatVersion: "1.9.0",
            expectFinding: true,
        },
        {
            name: "resource animation 1.8.0 is below the exact 1.10.0",
            path: "RP/animations/walk.json",
            rootKey: "animations",
            formatVersion: "1.8.0",
            expectFinding: true,
        },
        {
            name: "attachable 1.21.0 is above the lowest 1.10.0 so it is not below",
            path: "RP/attachables/hat.json",
            rootKey: "minecraft:attachable",
            formatVersion: "1.21.0",
            expectFinding: false,
        },
        {
            name: "attachable 1.9.0 is below the lowest 1.10.0",
            path: "RP/attachables/hat.json",
            rootKey: "minecraft:attachable",
            formatVersion: "1.9.0",
            expectFinding: true,
        },
        {
            name: "resource entity 1.10.0 equals the lowest version",
            path: "RP/entity/a.json",
            rootKey: "minecraft:client_entity",
            formatVersion: "1.10.0",
            expectFinding: false,
        },
        {
            name: "resource entity 1.9.0 is below the lowest 1.10.0",
            path: "RP/entity/a.json",
            rootKey: "minecraft:client_entity",
            formatVersion: "1.9.0",
            expectFinding: true,
        },
        {
            name: "geometry 1.8.0 equals the lowest version",
            path: "RP/models/a.geo.json",
            rootKey: "minecraft:geometry",
            formatVersion: "1.8.0",
            expectFinding: false,
        },
        {
            name: "geometry 1.7.0 is below the lowest 1.8.0",
            path: "RP/models/a.geo.json",
            rootKey: "minecraft:geometry",
            formatVersion: "1.7.0",
            expectFinding: true,
        },
        {
            name: "particle 1.10.0 equals the lowest version",
            path: "RP/particles/smoke.json",
            rootKey: "particle_effect",
            formatVersion: "1.10.0",
            expectFinding: false,
        },
        {
            name: "particle 1.9.0 is below the lowest 1.10.0",
            path: "RP/particles/smoke.json",
            rootKey: "particle_effect",
            formatVersion: "1.9.0",
            expectFinding: true,
        },
        {
            name: "client biome 10.20.0 is more than one minor below the current release",
            path: "RP/biomes/a.json",
            rootKey: "minecraft:client_biome",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
        {
            name: "feature rule 10.20.0 is more than one minor below the current release",
            path: "BP/feature_rules/a.json",
            rootKey: "minecraft:feature_rules",
            formatVersion: "10.20.0",
            expectFinding: true,
        },
    ];

    static run(entry: DefinitionFormatVersionBelowExpectedReportsOlderVersionCase): Promise<Finding[]> {
        return FormatVersionFixture.expected(new FormatVersionBelowExpected(), entry);
    }
}

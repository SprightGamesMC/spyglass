import type { Finding } from "../../src/Types/CheckTypes.js";
import type { DefinitionFormatVersionAboveExpectedReportsNewerVersionCase } from "../Types/DefinitionFormatVersionAboveExpectedReportsNewerVersionTypes.js";
import FormatVersionAboveExpected from "../../src/Checks/Definition/FormatVersionAboveExpected.js";
import FormatVersionFixture from "./Core/FormatVersionFixture.js";

export default abstract class DefinitionFormatVersionAboveExpectedReportsNewerVersion {
    static readonly ID = "DEFINITION/502";
    static readonly CASES: readonly DefinitionFormatVersionAboveExpectedReportsNewerVersionCase[] = [
        {
            name: "entity 10.30.20 equals the current release",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "entity 10.30.10 has a lower patch than the current release",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "10.30.10",
            expectFinding: false,
        },
        {
            name: "entity 11.0.0 has a higher major than the current release",
            path: "BP/entities/a.json",
            rootKey: "minecraft:entity",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "item 10.31.0 has a higher minor than the current release",
            path: "BP/items/a.json",
            rootKey: "minecraft:item",
            formatVersion: "10.31.0",
            expectFinding: true,
        },
        {
            name: "block 10.30.30 has a higher patch on the current minor",
            path: "BP/blocks/a.json",
            rootKey: "minecraft:block",
            formatVersion: "10.30.30",
            expectFinding: true,
        },
        {
            name: "recipe 10.31.0 has a higher minor than the current release",
            path: "BP/recipes/a.json",
            rootKey: "minecraft:recipe_shaped",
            formatVersion: "10.31.0",
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
            expectFinding: true,
        },
        {
            name: "fog 10.28.50 has a higher patch than the version read from vanilla data",
            path: "RP/fogs/a.json",
            rootKey: "minecraft:fog_settings",
            formatVersion: "10.28.50",
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
            name: "render controller 11.0.0 has a higher major than the version read from vanilla data",
            path: "RP/render_controllers/a.json",
            rootKey: "render_controllers",
            formatVersion: "11.0.0",
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
            name: "texture set 10.29.0 has a higher minor than the version read from vanilla data",
            path: "RP/textures/blocks/a.texture_set.json",
            rootKey: "minecraft:texture_set",
            formatVersion: "10.29.0",
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
            name: "spawn rule 10.29.0 has a higher minor than the version read from vanilla data",
            path: "BP/spawn_rules/a.json",
            rootKey: "minecraft:spawn_rules",
            formatVersion: "10.29.0",
            expectFinding: true,
        },
        {
            name: "spawn rule 10.28.41 has a higher patch on the expected minor",
            path: "BP/spawn_rules/a.json",
            rootKey: "minecraft:spawn_rules",
            formatVersion: "10.28.41",
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
            name: "resource animation controller 1.8.0 is below the exact 1.10.0 so it is not above",
            path: "RP/animation_controllers/ai.json",
            rootKey: "animation_controllers",
            formatVersion: "1.8.0",
            expectFinding: false,
        },
        {
            name: "behavior animation 1.10.1 is above the exact 1.10.0 by patch",
            path: "BP/animations/walk.json",
            rootKey: "animations",
            formatVersion: "1.10.1",
            expectFinding: true,
        },
        {
            name: "resource animation 1.21.0 is above the exact 1.10.0 by minor",
            path: "RP/animations/walk.json",
            rootKey: "animations",
            formatVersion: "1.21.0",
            expectFinding: true,
        },
        {
            name: "attachable 1.21.0 is above the lowest 1.10.0 but below the current release",
            path: "RP/attachables/hat.json",
            rootKey: "minecraft:attachable",
            formatVersion: "1.21.0",
            expectFinding: false,
        },
        {
            name: "attachable 11.0.0 is above the current release",
            path: "RP/attachables/hat.json",
            rootKey: "minecraft:attachable",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "resource entity 10.30.20 equals the current release",
            path: "RP/entity/a.json",
            rootKey: "minecraft:client_entity",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "resource entity 11.0.0 is above the current release",
            path: "RP/entity/a.json",
            rootKey: "minecraft:client_entity",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "geometry 10.30.20 equals the current release",
            path: "RP/models/a.geo.json",
            rootKey: "minecraft:geometry",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "geometry 11.0.0 is above the current release",
            path: "RP/models/a.geo.json",
            rootKey: "minecraft:geometry",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "particle 10.30.20 equals the current release",
            path: "RP/particles/smoke.json",
            rootKey: "particle_effect",
            formatVersion: "10.30.20",
            expectFinding: false,
        },
        {
            name: "particle 11.0.0 is above the current release",
            path: "RP/particles/smoke.json",
            rootKey: "particle_effect",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "client biome 11.0.0 is above the current release",
            path: "RP/biomes/a.json",
            rootKey: "minecraft:client_biome",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
        {
            name: "feature rule 11.0.0 is above the current release",
            path: "BP/feature_rules/a.json",
            rootKey: "minecraft:feature_rules",
            formatVersion: "11.0.0",
            expectFinding: true,
        },
    ];

    static run(entry: DefinitionFormatVersionAboveExpectedReportsNewerVersionCase): Promise<Finding[]> {
        return FormatVersionFixture.expected(new FormatVersionAboveExpected(), entry);
    }
}

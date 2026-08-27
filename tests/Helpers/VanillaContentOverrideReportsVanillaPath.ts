import type { VanillaData } from "../../src/Types/LoaderTypes.js";
import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { VanillaContentOverrideReportsVanillaPathCase } from "../Types/VanillaContentOverrideReportsVanillaPathTypes.js";
import VanillaContentOverride from "../../src/Checks/Addon/VanillaContentOverride.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class VanillaContentOverrideReportsVanillaPath {
    static readonly ID = "ADDON/701";
    static readonly VANILLA: VanillaData = {
        files: {
            "textures/blocks/stone.png": "hash",
            "entity/zombie.entity.json": "hash",
            "splashes.json": "hash",
            "sounds/sound_definitions.json": "hash",
            "texts/en_us.lang": "hash",
            "lighting/global.json": "hash",
            "lighting/desert_lighting.json": "hash",
            "ui/hud_screen.json": "hash",
        },
        properties: {},
    };
    static readonly CASES: readonly VanillaContentOverrideReportsVanillaPathCase[] = [
        {
            name: "textures/spright_cave/a.png is at no vanilla path",
            packType: "resource",
            paths: ["textures/spright_cave/a.png"],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "textures/blocks/stone.tga is at the vanilla stone texture path whatever its extension",
            packType: "resource",
            paths: ["textures/blocks/stone.tga"],
            expectedIds: ["ADDON/701"],
            expectedPaths: [AddonFixture.RP + "textures/blocks/stone.tga"],
        },
        {
            name: "entity/zombie.entity.json is at the vanilla client entity path",
            packType: "resource",
            paths: ["entity/zombie.entity.json"],
            expectedIds: ["ADDON/701"],
            expectedPaths: [AddonFixture.RP + "entity/zombie.entity.json"],
        },
        {
            name: "splashes.json at the pack root is at a vanilla path",
            packType: "resource",
            paths: ["splashes.json"],
            expectedIds: ["ADDON/701"],
            expectedPaths: [AddonFixture.RP + "splashes.json"],
        },
        {
            name: "sound_definitions.json, en_US.lang, lighting/global.json, and pack_icon.png are files every pack provides",
            packType: "resource",
            paths: ["sounds/sound_definitions.json", "texts/en_US.lang", "lighting/global.json", "pack_icon.png"],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "lighting/desert_lighting.json replaces the vanilla lighting of a vanilla biome",
            packType: "resource",
            paths: ["lighting/desert_lighting.json"],
            expectedIds: ["ADDON/701"],
            expectedPaths: [AddonFixture.RP + "lighting/desert_lighting.json"],
        },
        {
            name: "ui/hud_screen.json is left to ADDON/702, which reports the whole ui folder",
            packType: "resource",
            paths: ["ui/hud_screen.json"],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "stone texture inside a subpack is at the vanilla path the subpack provides",
            packType: "resource",
            paths: ["subpacks/tier2/textures/blocks/stone.png"],
            expectedIds: ["ADDON/701"],
            expectedPaths: [AddonFixture.RP + "subpacks/tier2/textures/blocks/stone.png"],
        },
    ];

    static async run(entry: VanillaContentOverrideReportsVanillaPathCase): Promise<FindingSummary> {
        return ModelFixture.summary(new VanillaContentOverride(), AddonFixture.packPathFiles(entry), {
            layout: "marketplace",
            vanilla: VanillaContentOverrideReportsVanillaPath.VANILLA,
        });
    }
}

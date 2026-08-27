import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { AssetUnusedReportsUnreferencedAssetCase } from "../Types/AssetUnusedReportsUnreferencedAssetTypes.js";
import AssetUnused from "../../src/Checks/Pack/AssetUnused.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class AssetUnusedReportsUnreferencedAsset {
    static readonly ID = "PACK/301";
    static readonly CASES: readonly AssetUnusedReportsUnreferencedAssetCase[] = [
        {
            name: "every texture and sound is referenced by the entity or sound definitions or is a vanilla path ignoring extension, a path listed in the vanilla sound_definitions.json, an engine path, a texture set companion, or under a prefix from a ui expression, and the font glyph is outside textures",
            referenceTexture: true,
            includeUnusedFiles: false,
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "texture and sound referenced by entity and sound definitions are used, unreferenced ones are unused",
            referenceTexture: true,
            includeUnusedFiles: true,
            expectedIds: ["PACK/301", "PACK/301"],
            expectedPaths: ["RP/sounds/custom/unused.ogg", "RP/textures/entity/unused.png"],
        },
        {
            name: "texture with no entity reference is unused",
            referenceTexture: false,
            includeUnusedFiles: true,
            expectedIds: ["PACK/301", "PACK/301", "PACK/301"],
            expectedPaths: ["RP/sounds/custom/unused.ogg", "RP/textures/entity/unused.png", "RP/textures/entity/used.png"],
        },
    ];

    static run(entry: AssetUnusedReportsUnreferencedAssetCase): Promise<FindingSummary> {
        const files: FixtureFiles = {
            "RP/manifest.json": ModelFixture.resourceManifest(),
            "RP/entity/thing.entity.json": {
                format_version: "1.10.0",
                "minecraft:client_entity": {
                    description: {
                        identifier: "custom:thing",
                        textures: entry.referenceTexture ? { default: "textures/entity/used" } : {},
                    },
                },
            },
            "RP/sounds/sound_definitions.json": {
                format_version: "1.14.0",
                sound_definitions: { "custom.thing.say": { sounds: ["sounds/custom/used"] } },
            },
            "RP/textures/entity/used.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/textures/entity/used_mer.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/textures/entity/zombie/zombie.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/textures/environment/overworld_cubemap/cubemap_0.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/ui/hud.json": { hud: { icon: { type: "image", texture: "('textures/ui/controls/' + $device + '/jump')" } } },
            "RP/textures/ui/controls/desktop/jump.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/pack_icon.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/font/glyph_e0.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/sounds/custom/used.ogg": "ogg",
            "RP/sounds/music/game/records/13.wav": "wav",
            ...AssetUnusedReportsUnreferencedAsset.unusedFiles(entry.includeUnusedFiles),
        };
        const vanilla = {
            files: { "textures/entity/zombie/zombie.tga": "abc" },
            properties: {},
            soundPaths: ["sounds/music/game/records/13"],
        };
        return ModelFixture.summary(new AssetUnused(), files, { vanilla });
    }

    private static unusedFiles(include: boolean): FixtureFiles {
        if (!include) {
            return {};
        }

        return {
            "RP/textures/entity/unused.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/sounds/custom/unused.ogg": "ogg",
        };
    }
}

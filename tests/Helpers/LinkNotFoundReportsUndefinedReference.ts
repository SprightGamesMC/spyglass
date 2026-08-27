import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { LinkNotFoundReportsUndefinedReferenceCase } from "../Types/LinkNotFoundReportsUndefinedReferenceTypes.js";
import LinkNotFound from "../../src/Checks/Pack/LinkNotFound.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LinkNotFoundReportsUndefinedReference {
    static readonly ID = "PACK/302";
    static readonly VANILLA = {
        files: {},
        properties: {},
        definitionIds: { animation: ["animation.humanoid.walk"], render_controller: ["controller.render.default"] },
        soundPaths: ["sounds/music/game/creative/creative1"],
    };
    static readonly EXPECTED_PATHS: readonly string[] = [
        "RP/entity/thing.entity.json",
        "RP/animation_controllers/thing.ac.json",
        "RP/textures/entity/thing.texture_set.json",
        "RP/sounds/sound_definitions.json",
        "RP/particles/thing.particle.json",
    ];
    static readonly CASES: readonly LinkNotFoundReportsUndefinedReferenceCase[] = [
        {
            name: "geometry.thing custom:thing the walk alias and the slash form texture set color layer are defined in the packs or vanilla",
            geometry: "geometry.thing",
            texture: "textures/entity/thing",
            textureSetColor: "textures/entity/thing",
            entity: "custom:thing",
            controllerAlias: "walk",
            sound: "sounds/music/game/creative/creative1",
            expectedMessages: [],
        },
        {
            name: "the dotted texture name thing.test.test keeps its dot and matches thing.test.test.png",
            geometry: "geometry.thing",
            texture: "textures/entity/thing.test.test",
            textureSetColor: "thing.test.test",
            entity: "custom:thing",
            controllerAlias: "walk",
            sound: "sounds/music/game/creative/creative1",
            expectedMessages: [],
        },
        {
            name: "texture file that is only inside a subpack is defined for a reference from the pack root",
            geometry: "geometry.thing",
            texture: "textures/entity/thing",
            textureSetColor: "textures/entity/thing",
            textureInSubpack: true,
            entity: "custom:thing",
            controllerAlias: "walk",
            sound: "sounds/music/game/creative/creative1",
            expectedMessages: [],
        },
        {
            name: "the atlas.terrain particle texture is an engine atlas and the hash color texture set layer is a color",
            geometry: "geometry.thing",
            texture: "textures/entity/thing",
            textureSetColor: "#0501a4",
            particleTexture: "atlas.terrain",
            entity: "custom:thing",
            controllerAlias: "walk",
            sound: "sounds/music/game/creative/creative1",
            expectedMessages: [],
        },
        {
            name: "the particle texture textures/particle/missing is a path so it is reported",
            geometry: "geometry.thing",
            texture: "textures/entity/thing",
            textureSetColor: "textures/entity/thing",
            particleTexture: "textures/particle/missing",
            entity: "custom:thing",
            controllerAlias: "walk",
            sound: "sounds/music/game/creative/creative1",
            expectedMessages: ["Referenced texture textures/particle/missing is not defined in any pack"],
        },
        {
            name: "geometry.missing textures/entity/missing custom:missing missing_alias and the missing_color layer are defined nowhere",
            geometry: "geometry.missing",
            texture: "textures/entity/missing",
            textureSetColor: "missing_color",
            entity: "custom:missing",
            controllerAlias: "missing_alias",
            sound: "sounds/missing/track",
            expectedMessages: [
                "Referenced animation alias missing_alias is not defined in any pack",
                "Referenced entity custom:missing is not defined in any pack",
                "Referenced geometry geometry.missing is not defined in any pack",
                "Referenced sound sounds/missing/track is not defined in any pack",
                "Referenced texture textures/entity/missing is not defined in any pack",
                "Referenced texture textures/entity/missing_color is not defined in any pack",
            ],
        },
    ];

    static particleFiles(texture: string | undefined): FixtureFiles {
        if (texture === undefined) {
            return {};
        }

        return {
            "RP/particles/thing.particle.json": {
                format_version: "1.10.0",
                particle_effect: {
                    description: { identifier: "custom:thing", basic_render_parameters: { material: "particles_alpha", texture } },
                },
            },
        };
    }

    static texturePath(inSubpack: boolean): string {
        return inSubpack ? "RP/subpacks/tier2/textures/entity/thing.png" : "RP/textures/entity/thing.png";
    }

    static run(entry: LinkNotFoundReportsUndefinedReferenceCase): Promise<Finding[]> {
        const files: FixtureFiles = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "BP/entities/thing.json": { format_version: "1.16.0", "minecraft:entity": { description: { identifier: "custom:thing" } } },
            "RP/manifest.json": ModelFixture.resourceManifest(),
            "RP/models/entity/thing.geo.json": {
                format_version: "1.12.0",
                "minecraft:geometry": [{ description: { identifier: "geometry.thing" } }],
            },
            [LinkNotFoundReportsUndefinedReference.texturePath(entry.textureInSubpack === true)]: ImageBytes.png({ width: 4, height: 4 }),
            "RP/textures/entity/thing.test.test.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/textures/entity/thing.texture_set.json": { "minecraft:texture_set": { color: entry.textureSetColor } },
            ...LinkNotFoundReportsUndefinedReference.particleFiles(entry.particleTexture),
            "RP/sounds/sound_definitions.json": {
                format_version: "1.20.20",
                sound_definitions: { "custom:track": { sounds: [entry.sound] } },
            },
            "RP/animation_controllers/thing.ac.json": {
                format_version: "1.10.0",
                animation_controllers: {
                    "controller.animation.thing": { states: { default: { animations: [entry.controllerAlias] } } },
                },
            },
            "RP/entity/thing.entity.json": {
                format_version: "1.10.0",
                "minecraft:client_entity": {
                    description: {
                        identifier: entry.entity,
                        geometry: { default: entry.geometry },
                        textures: { default: entry.texture },
                        animations: { walk: "animation.humanoid.walk" },
                        render_controllers: ["controller.render.default"],
                    },
                },
            },
        };

        return ModelFixture.findings(new LinkNotFound(), files, { vanilla: LinkNotFoundReportsUndefinedReference.VANILLA });
    }
}

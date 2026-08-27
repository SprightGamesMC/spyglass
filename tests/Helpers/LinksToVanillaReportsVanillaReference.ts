import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { LinksToVanillaReportsVanillaReferenceCase } from "../Types/LinksToVanillaReportsVanillaReferenceTypes.js";
import LinksToVanilla from "../../src/Checks/Pack/LinksToVanilla.js";
import ImageBytes from "./Core/ImageBytes.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class LinksToVanillaReportsVanillaReference {
    static readonly ID = "PACK/303";
    static readonly CASES: readonly LinksToVanillaReportsVanillaReferenceCase[] = [
        {
            name: "geometry.thing textures/entity/thing and custom:thing are defined in the pack not vanilla",
            geometry: "geometry.thing",
            texture: "textures/entity/thing",
            entity: "custom:thing",
            expectedFields: [],
        },
        {
            name: "geometry.humanoid.custom zombie texture and minecraft:zombie are vanilla ids",
            geometry: "geometry.humanoid.custom",
            texture: "textures/entity/zombie/zombie",
            entity: "minecraft:zombie",
            expectedFields: ["description.identifier", "geometry.default", "textures.default"],
        },
    ];

    static excludedContentTypes(): readonly string[] {
        return new LinksToVanilla().definition.excludedContentTypes ?? [];
    }

    static run(entry: LinksToVanillaReportsVanillaReferenceCase): Promise<Finding[]> {
        const files: FixtureFiles = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "BP/entities/thing.json": { format_version: "1.16.0", "minecraft:entity": { description: { identifier: "custom:thing" } } },
            "RP/manifest.json": ModelFixture.resourceManifest(),
            "RP/models/entity/thing.geo.json": {
                format_version: "1.12.0",
                "minecraft:geometry": [{ description: { identifier: "geometry.thing" } }],
            },
            "RP/textures/entity/thing.png": ImageBytes.png({ width: 4, height: 4 }),
            "RP/entity/thing.entity.json": {
                format_version: "1.10.0",
                "minecraft:client_entity": {
                    description: {
                        identifier: entry.entity,
                        geometry: { default: entry.geometry },
                        textures: { default: entry.texture },
                    },
                },
            },
        };
        const vanilla = {
            files: { "textures/entity/zombie/zombie.png": "abc" },
            properties: {},
            definitionIds: { geometry: ["geometry.humanoid.custom"] },
        };
        return ModelFixture.findings(new LinksToVanilla(), files, { vanilla });
    }
}

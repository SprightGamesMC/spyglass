import type { Finding } from "../../src/Types/CheckTypes.js";
import type { MeshCase } from "../Types/MeshNotAllowedReportsBoneWithMeshTypes.js";
import MeshNotAllowed from "../../src/Checks/Model/MeshNotAllowed.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class MeshNotAllowedReportsBoneWithMesh {
    static readonly ID = "MODEL/201";
    static readonly PATH = "RP/models/entity/thing.geo.json";
    static readonly CASES: readonly MeshCase[] = [
        {
            name: "bones body and head with only cubes use no poly_mesh",
            content: {
                format_version: "1.12.0",
                "minecraft:geometry": [
                    {
                        description: { identifier: "geometry.thing" },
                        bones: [
                            { name: "body", cubes: [] },
                            { name: "head", cubes: [{ origin: [0, 0, 0], size: [1, 1, 1] }] },
                        ],
                    },
                ],
            },
            expectedFields: [],
        },
        {
            name: "bone head with poly_mesh in a 1.12.0 geometry uses a mesh type that is not allowed",
            content: {
                format_version: "1.12.0",
                "minecraft:geometry": [
                    {
                        description: { identifier: "geometry.thing" },
                        bones: [
                            { name: "body", cubes: [] },
                            { name: "head", poly_mesh: { normalized_uvs: true } },
                        ],
                    },
                ],
            },
            expectedFields: ["geometry.thing.bones.head.poly_mesh"],
        },
        {
            name: "bone head with poly_mesh in a 1.8.0 geometry uses a mesh type that is not allowed",
            content: { format_version: "1.8.0", "geometry.thing": { bones: [{ name: "head", poly_mesh: {} }] } },
            expectedFields: ["geometry.thing.bones.head.poly_mesh"],
        },
        {
            name: "bone head with texture_mesh uses a mesh type that is not allowed",
            content: {
                format_version: "1.12.0",
                "minecraft:geometry": [
                    {
                        description: { identifier: "geometry.thing" },
                        bones: [{ name: "head", texture_mesh: { texture: "thing" } }],
                    },
                ],
            },
            expectedFields: ["geometry.thing.bones.head.texture_mesh"],
        },
        { name: "geometry file that does not parse is skipped", content: "{", expectedFields: [] },
    ];

    static run(content: object | string): Promise<Finding[]> {
        const files = { "RP/manifest.json": ModelFixture.resourceManifest(), [MeshNotAllowedReportsBoneWithMesh.PATH]: content };

        return ModelFixture.findings(new MeshNotAllowed(), files);
    }
}

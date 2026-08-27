import type { Finding } from "../../src/Types/CheckTypes.js";
import type { BlockGeometryCase } from "../Types/BlockGeometryTooComplexReportsOverFiftyCubesTypes.js";
import BlockGeometryTooComplex from "../../src/Checks/Model/BlockGeometryTooComplex.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class BlockGeometryTooComplexReportsOverFiftyCubes {
    static readonly ID = "MODEL/401";
    static readonly BLOCK_PATH = "RP/models/blocks/crate.geo.json";
    static readonly ENTITY_PATH = "RP/models/entity/thing.geo.json";
    static readonly CASES: readonly BlockGeometryCase[] = [
        {
            name: "block geometry with 50 cubes is at the 50 cube limit",
            path: BlockGeometryTooComplexReportsOverFiftyCubes.BLOCK_PATH,
            content: BlockGeometryTooComplexReportsOverFiftyCubes.modern("geometry.crate", [50]),
            expectFinding: false,
        },
        {
            name: "block geometry with 51 cubes across two bones is above the 50 cube limit",
            path: BlockGeometryTooComplexReportsOverFiftyCubes.BLOCK_PATH,
            content: BlockGeometryTooComplexReportsOverFiftyCubes.modern("geometry.crate", [30, 21]),
            expectFinding: true,
        },
        {
            name: "legacy format block geometry with 51 cubes is above the 50 cube limit",
            path: BlockGeometryTooComplexReportsOverFiftyCubes.BLOCK_PATH,
            content: BlockGeometryTooComplexReportsOverFiftyCubes.legacy("geometry.crate", [51]),
            expectFinding: true,
        },
        {
            name: "entity geometry with 80 cubes is outside the blocks folder so the cube limit does not apply",
            path: BlockGeometryTooComplexReportsOverFiftyCubes.ENTITY_PATH,
            content: BlockGeometryTooComplexReportsOverFiftyCubes.modern("geometry.thing", [80]),
            expectFinding: false,
        },
        {
            name: "block geometry file that does not parse is skipped",
            path: BlockGeometryTooComplexReportsOverFiftyCubes.BLOCK_PATH,
            content: "{",
            expectFinding: false,
        },
    ];

    static modern(identifier: string, cubesPerBone: readonly number[]): object {
        return {
            format_version: "1.12.0",
            "minecraft:geometry": [
                { description: { identifier }, bones: BlockGeometryTooComplexReportsOverFiftyCubes.bones(cubesPerBone) },
            ],
        };
    }

    static legacy(identifier: string, cubesPerBone: readonly number[]): object {
        return { format_version: "1.8.0", [identifier]: { bones: BlockGeometryTooComplexReportsOverFiftyCubes.bones(cubesPerBone) } };
    }

    static bones(cubesPerBone: readonly number[]): object[] {
        return cubesPerBone.map((count, index) => ({
            name: "bone" + index,
            cubes: Array.from({ length: count }, () => ({ origin: [0, 0, 0], size: [1, 1, 1] })),
        }));
    }

    static run(entry: BlockGeometryCase): Promise<Finding[]> {
        const files = { "RP/manifest.json": ModelFixture.resourceManifest(), [entry.path]: entry.content };

        return ModelFixture.findings(new BlockGeometryTooComplex(), files);
    }
}

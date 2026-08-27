import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { GeometryDefinition } from "../../Types/GeometryTypes.js";
import GeometryReader from "../../Loaders/GeometryReader.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import ModelChecks from "./ModelChecks.js";
import ModelLimits from "./ModelLimits.js";

export default class BlockGeometryTooComplex extends Check {
    readonly definition: CheckDefinition = {
        group: ModelChecks.GROUP,
        number: ModelChecks.BLOCK_GEOMETRY_TOO_COMPLEX,
        slug: "block-geometry-too-complex",
        severity: "warning",
        description: "Block geometry has more than " + ModelLimits.BLOCK_CUBE_LIMIT + " cubes",
    };

    private static countCubes(geometry: GeometryDefinition): number {
        let total = 0;

        for (const bone of geometry.bones) {
            const cubes = bone["cubes"];

            if (JsonLoader.isArray(cubes)) {
                total += cubes.length;
            }
        }

        return total;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, ModelLimits.KINDS)) {
            if (!item.path.toLowerCase().includes(ModelLimits.BLOCK_PATH_MARKER)) {
                continue;
            }

            for (const geometry of await GeometryReader.read(context, item.path)) {
                const cubes = BlockGeometryTooComplex.countCubes(geometry);

                if (cubes <= ModelLimits.BLOCK_CUBE_LIMIT) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Block geometry " + geometry.identifier + " has " + cubes + " cubes, limit is " + ModelLimits.BLOCK_CUBE_LIMIT,
                        item.path,
                        pack.root,
                        { field: geometry.identifier }
                    )
                );
            }
        }

        return findings;
    }
}

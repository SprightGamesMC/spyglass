import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import ChunkChecks from "./ChunkChecks.js";

export default class DimensionMappingUnclaimed extends Check {
    readonly definition: CheckDefinition = {
        group: ChunkChecks.GROUP,
        number: ChunkChecks.DIMENSION_MAPPING_UNCLAIMED,
        slug: "dimension-mapping-unclaimed",
        severity: "warning",
        description: "DimensionNameIdTable entry with no chunk data",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);

            for (const [name, id] of data.dimensionTable) {
                if (id < WorldLoader.CUSTOM_DIMENSION_ID_START || data.chunkDimensionIds.has(id)) {
                    continue;
                }

                findings.push(
                    this.finding("DimensionNameIdTable maps " + name + " to id " + id + " but no chunk data uses that id", world.root)
                );
            }
        }

        return findings;
    }
}

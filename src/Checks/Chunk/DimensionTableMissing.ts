import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import ChunkChecks from "./ChunkChecks.js";

export default class DimensionTableMissing extends Check {
    readonly definition: CheckDefinition = {
        group: ChunkChecks.GROUP,
        number: ChunkChecks.DIMENSION_TABLE_MISSING,
        slug: "dimension-table-missing",
        severity: "error",
        description: "Custom dimension chunk data with no DimensionNameIdTable",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);
            const customIds = [...data.chunkDimensionIds].filter((id) => id >= WorldLoader.CUSTOM_DIMENSION_ID_START);

            if (customIds.length === 0 || data.hasDimensionTable) {
                continue;
            }

            findings.push(
                this.finding(
                    "Chunk data for custom dimension ids " +
                        customIds.sort((left, right) => left - right).join(", ") +
                        " has no DimensionNameIdTable",
                    world.root
                )
            );
        }

        return findings;
    }
}

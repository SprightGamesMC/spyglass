import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class VanillaDimensionChunkData extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.VANILLA_DIMENSION_CHUNK_DATA,
        slug: "vanilla-dimension-chunk-data",
        severity: "error",
        description: "World data contains chunks for a vanilla dimension",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);
            const vanillaIds = [...data.chunkDimensionIds]
                .filter((id) => id < WorldLoader.CUSTOM_DIMENSION_ID_START)
                .sort((left, right) => left - right);

            for (const id of vanillaIds) {
                const name = AddonLimits.VANILLA_DIMENSION_NAMES[id] ?? "id " + id;

                findings.push(
                    this.finding(
                        "World data has chunks for vanilla dimension " +
                            name +
                            " (" +
                            id +
                            "), only custom dimensions from " +
                            WorldLoader.CUSTOM_DIMENSION_ID_START +
                            " are allowed",
                        world.root
                    )
                );
            }
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TieringInvalidForVibrantVisuals extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TIERING_INVALID_FOR_VIBRANT_VISUALS,
        slug: "tiering-invalid-for-vibrant-visuals",
        severity: "error",
        description: "Pack supports Vibrant Visuals but exceeds the tier " + TextureLimits.VIBRANT_VISUALS_TIER + " texture memory limit",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const tier = TextureLimits.VIBRANT_VISUALS_TIER;
        const limit = TextureLimits.tierLimitBytes(context.contentType, tier);

        for (const memory of await TextureMemoryLoader.load(context)) {
            if (!memory.capabilities.includes(TextureLimits.PBR_CAPABILITY)) {
                continue;
            }

            const total = TextureMemoryLoader.tiers(memory)[tier].total;

            if (total <= limit) {
                continue;
            }

            findings.push(
                this.finding(
                    "Pack declares the pbr capability and uses " +
                        TextureLimits.formatMebibytes(total) +
                        " of texture memory at tier " +
                        tier +
                        ", over the " +
                        TextureLimits.formatMebibytes(limit) +
                        " limit for " +
                        TextureLimits.tableFor(context.contentType) +
                        " content",
                    memory.pack.manifestPath,
                    memory.pack.root
                )
            );
        }

        return findings;
    }
}

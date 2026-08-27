import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { PackTextureMemory } from "../../Types/TextureTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class BaseContentUnusedInLowerTiers extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.BASE_CONTENT_UNUSED_IN_LOWER_TIERS,
        slug: "base-content-unused-in-lower-tiers",
        severity: "warning",
        description: "Lowest subpack tier overrides " + TextureLimits.BASE_OVERLAP_PERCENT + " percent or more of base pack textures",
    };

    private static lowestTier(memory: PackTextureMemory): number | undefined {
        const tiers = memory.subpacks.map((subpack) => subpack.tier).filter((tier): tier is number => tier !== undefined);

        return tiers.length === 0 ? undefined : Math.min(...tiers);
    }

    private static overlapPercent(memory: PackTextureMemory, tier: number): number | undefined {
        const baseKeys = new Set(memory.images.filter((image) => image.subpackFolder === undefined).map((image) => image.key));
        const tierKeys = new Set(memory.images.filter((image) => image.tier === tier).map((image) => image.key));

        if (baseKeys.size === 0) {
            return undefined;
        }

        const overlap = [...tierKeys].filter((key) => baseKeys.has(key)).length;

        return (overlap / baseKeys.size) * 100;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            const lowest = BaseContentUnusedInLowerTiers.lowestTier(memory);

            if (lowest === undefined || lowest < TextureLimits.OVERLAP_MINIMUM_TIER) {
                continue;
            }

            const percent = BaseContentUnusedInLowerTiers.overlapPercent(memory, lowest);

            if (percent === undefined || percent < TextureLimits.BASE_OVERLAP_PERCENT) {
                continue;
            }

            findings.push(
                this.finding(
                    "The lowest subpack tier " +
                        lowest +
                        " overrides " +
                        percent.toFixed(1) +
                        " percent of the base pack textures, so the base pack content is mostly unused",
                    memory.pack.manifestPath,
                    memory.pack.root
                )
            );
        }

        return findings;
    }
}

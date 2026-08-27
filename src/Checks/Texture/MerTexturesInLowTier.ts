import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { TextureImage } from "../../Types/TextureTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class MerTexturesInLowTier extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.MER_TEXTURES_IN_LOW_TIER,
        slug: "mer-textures-in-low-tier",
        severity: "error",
        description: "A subpack at tier " + TextureLimits.LOW_TIER_MAXIMUM + " or lower includes MER textures",
    };

    private static isLowTier(tier: number | undefined): boolean {
        return tier !== undefined && tier <= TextureLimits.LOW_TIER_MAXIMUM;
    }

    private static loadsInLowTier(image: TextureImage): boolean {
        return image.subpackFolder === undefined || MerTexturesInLowTier.isLowTier(image.tier);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            const lowTiers = memory.subpacks
                .map((subpack) => subpack.tier)
                .filter((tier): tier is number => MerTexturesInLowTier.isLowTier(tier));

            if (lowTiers.length === 0) {
                continue;
            }

            const lowest = Math.min(...lowTiers);

            for (const image of memory.images) {
                if (!MerTexturesInLowTier.loadsInLowTier(image) || !TextureMemoryLoader.isMer(image, memory)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "MER texture " +
                            image.key +
                            " loads with the subpack targeting tier " +
                            lowest +
                            ", which does not support MER textures",
                        image.item.path,
                        memory.pack.root
                    )
                );
            }
        }

        return findings;
    }
}

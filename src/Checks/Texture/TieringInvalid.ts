import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TieringInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TIERING_INVALID,
        slug: "tiering-invalid",
        severity: "error",
        description: "A lower subpack tier needs more texture memory than a higher tier",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            const tiers = TextureMemoryLoader.tiers(memory);

            for (const current of tiers) {
                if (!current.targeted) {
                    continue;
                }

                for (const lower of tiers.slice(0, current.tier)) {
                    if (lower.total <= current.total) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "Tier " +
                                lower.tier +
                                " needs " +
                                TextureLimits.formatMebibytes(lower.total) +
                                " of texture memory, more than tier " +
                                current.tier +
                                " at " +
                                TextureLimits.formatMebibytes(current.total),
                            memory.pack.manifestPath,
                            memory.pack.root
                        )
                    );
                }
            }
        }

        return findings;
    }
}

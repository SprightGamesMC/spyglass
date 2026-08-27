import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import TextureCoverageLoader from "../../Loaders/TextureCoverageLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class MashupCoverageLow extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.MASHUP_COVERAGE_LOW,
        slug: "mashup-coverage-low",
        severity: "error",
        description: "Global resource pack overrides under " + WorldLimits.MASHUP_COVERAGE_MINIMUM_PERCENT + " percent of vanilla textures",
    };

    private static globalResourcePacks(context: CheckContext): Pack[] {
        return context.model.packs.filter(
            (pack) =>
                pack.type === PackItemLoader.RESOURCE_PACK_TYPE &&
                !context.model.worlds.some((world) => PathUtilities.isInside(pack.root, world.root))
        );
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        if (context.model.worlds.length === 0) {
            return findings;
        }

        for (const pack of MashupCoverageLow.globalResourcePacks(context)) {
            const coverage = TextureCoverageLoader.forPack(context, pack);

            if (coverage.percent === undefined || coverage.percent >= WorldLimits.MASHUP_COVERAGE_MINIMUM_PERCENT) {
                continue;
            }

            findings.push(
                this.finding(
                    "Global resource pack overrides " +
                        (coverage.vanillaCount - coverage.missing.length) +
                        " of " +
                        coverage.vanillaCount +
                        " vanilla textures (" +
                        coverage.percent.toFixed(1) +
                        " percent), minimum is " +
                        WorldLimits.MASHUP_COVERAGE_MINIMUM_PERCENT +
                        " percent",
                    pack.manifestPath,
                    pack.root
                )
            );
        }

        return findings;
    }
}

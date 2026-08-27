import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureCoverageLoader from "../../Loaders/TextureCoverageLoader.js";
import Check from "../Check.js";
import TexturePackChecks from "./TexturePackChecks.js";
import TexturePackLimits from "./TexturePackLimits.js";

export default class CoverageTooLow extends Check {
    readonly definition: CheckDefinition = {
        group: TexturePackChecks.GROUP,
        number: TexturePackChecks.COVERAGE_TOO_LOW,
        slug: "coverage-too-low",
        severity: "error",
        description: "Under " + TexturePackLimits.COVERAGE_MINIMUM_PERCENT + " percent of vanilla textures are overridden",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const coverage = await TextureCoverageLoader.load(context);

        if (coverage.percent === undefined || coverage.percent >= TexturePackLimits.COVERAGE_MINIMUM_PERCENT) {
            return [];
        }

        return [
            this.finding(
                "Pack overrides " +
                    coverage.percent.toFixed(1) +
                    " percent of " +
                    coverage.vanillaCount +
                    " vanilla textures, under the " +
                    TexturePackLimits.COVERAGE_MINIMUM_PERCENT +
                    " percent minimum"
            ),
        ];
    }
}

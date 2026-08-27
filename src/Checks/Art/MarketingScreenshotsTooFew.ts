import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class MarketingScreenshotsTooFew extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_SCREENSHOTS_TOO_FEW,
        slug: "marketing-screenshots-too-few",
        severity: "error",
        description: "Fewer than " + ArtLimits.MARKETING_SCREENSHOT_MINIMUM + " marketing screenshots",
        excludedContentTypes: ["skin", "persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const count = ArtFileRoles.withRole(context.model, "marketing_screenshot").length;

        if (count >= ArtLimits.MARKETING_SCREENSHOT_MINIMUM) {
            return [];
        }

        return [
            this.finding(
                ArtLimits.MARKETING_FOLDER + " has " + count + " screenshots, expected at least " + ArtLimits.MARKETING_SCREENSHOT_MINIMUM,
                ArtLimits.MARKETING_FOLDER
            ),
        ];
    }
}

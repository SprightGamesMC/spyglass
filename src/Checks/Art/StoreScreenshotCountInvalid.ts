import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreScreenshotCountInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_SCREENSHOT_COUNT_INVALID,
        slug: "store-screenshot-count-invalid",
        severity: "error",
        description: "Store screenshot count is not exactly " + ArtLimits.STORE_SCREENSHOT_COUNT,
        excludedContentTypes: ["skin", "persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const count = ArtFileRoles.withRole(context.model, "store_screenshot").length;

        if (count === ArtLimits.STORE_SCREENSHOT_COUNT) {
            return [];
        }

        return [
            this.finding(
                ArtLimits.STORE_FOLDER + " has " + count + " screenshots, expected exactly " + ArtLimits.STORE_SCREENSHOT_COUNT,
                ArtLimits.STORE_FOLDER
            ),
        ];
    }
}

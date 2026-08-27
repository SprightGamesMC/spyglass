import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ImageMetadata } from "../../Types/LoaderTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldIconFinder from "./WorldIconFinder.js";
import WorldLimits from "./WorldLimits.js";

export default class IconInvalidSize extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.ICON_INVALID_SIZE,
        slug: "icon-invalid-size",
        severity: "error",
        description: "world_icon.jpeg is not " + WorldLimits.ICON_WIDTH + " by " + WorldLimits.ICON_HEIGHT,
    };

    private static isAllowed(metadata: ImageMetadata, allowEducationSize: boolean): boolean {
        if (metadata.width === WorldLimits.ICON_WIDTH && metadata.height === WorldLimits.ICON_HEIGHT) {
            return true;
        }

        return (
            allowEducationSize &&
            metadata.width === WorldLimits.EDUCATION_ICON_WIDTH &&
            metadata.height === WorldLimits.EDUCATION_ICON_HEIGHT
        );
    }

    private static describe(metadata: ImageMetadata, allowEducationSize: boolean): string {
        const expected = WorldLimits.ICON_WIDTH + " by " + WorldLimits.ICON_HEIGHT;
        const educationExpected = allowEducationSize
            ? " or " + WorldLimits.EDUCATION_ICON_WIDTH + " by " + WorldLimits.EDUCATION_ICON_HEIGHT
            : "";

        return "World icon is " + metadata.width + " by " + metadata.height + ", expected " + expected + educationExpected;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const allowEducationSize = WorldIconFinder.hasEducationItem(context.model);

        for (const world of context.model.worlds) {
            for (const icon of WorldIconFinder.find(world)) {
                const result = await context.loaders.image.read(icon.path);

                if (result.status !== "ok" || IconInvalidSize.isAllowed(result.metadata, allowEducationSize)) {
                    continue;
                }

                findings.push(this.finding(IconInvalidSize.describe(result.metadata, allowEducationSize), icon.path));
            }
        }

        return findings;
    }
}

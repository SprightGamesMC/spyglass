import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldIconFinder from "./WorldIconFinder.js";

export default class IconInvalidImage extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.ICON_INVALID_IMAGE,
        slug: "icon-invalid-image",
        severity: "error",
        description: "world_icon.jpeg cannot be decoded",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            for (const icon of WorldIconFinder.find(world)) {
                const result = await context.loaders.image.read(icon.path);

                if (result.status !== "invalid") {
                    continue;
                }

                findings.push(this.finding("World icon cannot be decoded as an image", icon.path));
            }
        }

        return findings;
    }
}

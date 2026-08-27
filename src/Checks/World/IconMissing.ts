import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldIconFinder from "./WorldIconFinder.js";

export default class IconMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.ICON_MISSING,
        slug: "icon-missing",
        severity: "error",
        description: "No world_icon.jpeg",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            if (WorldIconFinder.find(world).length > 0) {
                continue;
            }

            findings.push(this.finding("World has no world_icon.jpeg", world.root));
        }

        return findings;
    }
}

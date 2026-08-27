import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldIconFinder from "./WorldIconFinder.js";

export default class MultipleIcons extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.MULTIPLE_ICONS,
        slug: "multiple-icons",
        severity: "error",
        description: "More than one world_icon.jpeg",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const icons = WorldIconFinder.find(world);

            if (icons.length <= 1) {
                continue;
            }

            findings.push(this.finding("World has " + icons.length + " world icons, expected 1", world.root));
        }

        return findings;
    }
}

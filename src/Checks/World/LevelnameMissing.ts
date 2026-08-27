import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";

export default class LevelnameMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.LEVELNAME_MISSING,
        slug: "levelname-missing",
        severity: "error",
        description: "World has no levelname.txt",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            if (world.items.some((item) => item.kind === "levelname")) {
                continue;
            }

            findings.push(this.finding("World has no levelname.txt", world.root));
        }

        return findings;
    }
}

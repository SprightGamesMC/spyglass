import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";

export default class DatabaseMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.DATABASE_MISSING,
        slug: "database-missing",
        severity: "error",
        description: "World has no db folder files",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            if (world.items.some((item) => item.kind === "database")) {
                continue;
            }

            findings.push(this.finding("World has no files in its db folder, the world is incomplete", world.root));
        }

        return findings;
    }
}

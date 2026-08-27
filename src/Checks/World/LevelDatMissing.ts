import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";

export default class LevelDatMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.LEVEL_DAT_MISSING,
        slug: "level-dat-missing",
        severity: "warning",
        description: "World has no readable level.dat",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);

            if (data.levelDatPath === undefined) {
                findings.push(this.finding("World has no level.dat", world.root));
                continue;
            }

            if (data.levelDatUnparseable) {
                findings.push(this.finding("level.dat cannot be parsed as NBT", data.levelDatPath));
            }
        }

        return findings;
    }
}

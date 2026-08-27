import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { NbtCompound } from "../../Types/WorldTypes.js";
import NbtReader from "../../Loaders/NbtReader.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class ExperimentEnabled extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.EXPERIMENT_ENABLED,
        slug: "experiment-enabled",
        severity: "warning",
        description: "An experiment is or was enabled",
    };

    private static enabledExperiments(levelDat: NbtCompound): string[] {
        const enabled: string[] = [];

        if (NbtReader.isTrue(levelDat[WorldLimits.EXPERIMENTAL_GAMEPLAY])) {
            enabled.push(WorldLimits.EXPERIMENTAL_GAMEPLAY);
        }

        const experiments = levelDat[WorldLimits.EXPERIMENTS_COMPOUND];

        if (!NbtReader.isCompound(experiments)) {
            return enabled;
        }

        for (const [name, value] of Object.entries(experiments)) {
            if (WorldLimits.EXPERIMENT_IGNORED_KEYS.includes(name)) {
                continue;
            }

            if (NbtReader.isTrue(value)) {
                enabled.push(name);
            }
        }

        return enabled;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);

            if (data.levelDat === undefined || data.levelDatPath === undefined) {
                continue;
            }

            const enabled = ExperimentEnabled.enabledExperiments(data.levelDat);

            if (enabled.length === 0) {
                continue;
            }

            findings.push(this.finding("Experiments are or were enabled: " + enabled.join(", "), data.levelDatPath));
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import ScriptChecks from "./ScriptChecks.js";
import ScriptLimits from "./ScriptLimits.js";

export default class BetaModuleOutdated extends Check {
    readonly definition: CheckDefinition = {
        group: ScriptChecks.GROUP,
        number: ScriptChecks.BETA_MODULE_OUTDATED,
        slug: "beta-module-outdated",
        severity: "error",
        description: "Dependency uses a beta version older than the current beta",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== ScriptLimits.PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);

            ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
                const moduleName = dependency.module_name;
                const version = dependency.version;

                if (typeof moduleName !== "string" || typeof version !== "string") {
                    return;
                }

                if (!version.includes(ScriptLimits.BETA_VERSION_MARKER)) {
                    return;
                }

                const current = context.loaders.betaModuleVersions[moduleName];

                if (current === undefined || version.startsWith(current)) {
                    return;
                }

                const message = moduleName + " " + version + " is older than the current beta " + current;

                findings.push(this.finding(message, pack.manifestPath, pack.root, { field: "dependencies[" + index + "].version" }));
            });
        }

        return findings;
    }
}

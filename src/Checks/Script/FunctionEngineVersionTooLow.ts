import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";
import ScriptChecks from "./ScriptChecks.js";
import ScriptLimits from "./ScriptLimits.js";

export default class FunctionEngineVersionTooLow extends Check {
    readonly definition: CheckDefinition = {
        group: ScriptChecks.GROUP,
        number: ScriptChecks.FUNCTION_ENGINE_VERSION_TOO_LOW,
        slug: "function-engine-version-too-low",
        severity: "error",
        description: "Pack has functions with min_engine_version below 1.8.0",
    };

    private static hasFunctions(pack: Pack): boolean {
        return pack.items.some((item) => item.kind === "function");
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const required = ScriptLimits.FUNCTION_ENGINE_VERSION;

        for (const pack of context.model.packs) {
            if (pack.type !== ScriptLimits.PACK_TYPE || !FunctionEngineVersionTooLow.hasFunctions(pack)) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);
            const version = ManifestLoader.minEngineVersion(manifest);

            if (version === undefined || VersionUtilities.compare(version, required) >= 0) {
                continue;
            }

            findings.push(
                this.finding(
                    "Pack has functions and a min_engine_version of " +
                        VersionUtilities.format(version) +
                        ", functions need at least " +
                        VersionUtilities.format(required),
                    pack.manifestPath,
                    pack.root,
                    { field: "header.min_engine_version" }
                )
            );
        }

        return findings;
    }
}

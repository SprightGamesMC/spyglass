import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class OverridesProtectedVanillaAsset extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.OVERRIDES_PROTECTED_VANILLA_ASSET,
        slug: "overrides-protected-vanilla-asset",
        severity: "error",
        description: "File path matches a protected vanilla path",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const protectedPaths = PackLimits.PROTECTED_VANILLA_PATHS[pack.type];

            if (protectedPaths === undefined) {
                continue;
            }

            for (const item of pack.items) {
                const lower = item.packPath.toLowerCase();
                const match = protectedPaths.find((entry) => lower === entry || lower.startsWith(entry + "/"));

                if (match === undefined) {
                    continue;
                }

                findings.push(
                    this.finding("File " + item.packPath + " overrides the protected vanilla path " + match, item.path, pack.root)
                );
            }
        }

        return findings;
    }
}

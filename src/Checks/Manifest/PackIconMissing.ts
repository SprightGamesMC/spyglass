import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PackIconMissing extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PACK_ICON_MISSING,
        slug: "pack-icon-missing",
        severity: "error",
        description: "No pack_icon.png",
        excludedContentTypes: ["skin", "persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (ManifestLimits.PACK_ICON_EXEMPT_PACK_TYPES.includes(pack.type)) {
                continue;
            }

            if (pack.items.some((item) => item.kind === "pack_icon")) {
                continue;
            }

            findings.push(this.finding("No pack_icon.png found in pack", pack.manifestPath, pack.root));
        }

        return findings;
    }
}

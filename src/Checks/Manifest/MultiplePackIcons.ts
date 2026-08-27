import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";

export default class MultiplePackIcons extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MULTIPLE_PACK_ICONS,
        slug: "multiple-pack-icons",
        severity: "error",
        description: "More than one pack_icon file",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const icons = pack.items.filter((item) => item.kind === "pack_icon");

            if (icons.length <= 1) {
                continue;
            }

            const names = icons.map((icon) => icon.packPath).join(", ");

            findings.push(this.finding("Found " + icons.length + " pack icon files, expected 1: " + names, pack.manifestPath, pack.root));
        }

        return findings;
    }
}

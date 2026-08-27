import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class UiNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.UI_NOT_ALLOWED,
        slug: "ui-not-allowed",
        severity: "error",
        description: "ui folder present",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            const uiFolder = AddonPackFolders.typeFolders(pack).find((folder) => folder.toLowerCase() === AddonLimits.UI_FOLDER);

            if (uiFolder === undefined) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack has a ui folder, custom ui is not allowed in an add-on",
                    AddonPackFolders.folderPath(pack, uiFolder),
                    pack.root
                )
            );
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class StructuresFolderNameNotUnique extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.STRUCTURES_FOLDER_NAME_NOT_UNIQUE,
        slug: "structures-folder-name-not-unique",
        severity: "error",
        description: "structures subfolder name is not in unique form",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const typeFolder of AddonPackFolders.typeFolders(pack)) {
                if (!AddonPackFolders.isStructuresFolder(typeFolder)) {
                    continue;
                }

                for (const folder of AddonPackFolders.children(pack, typeFolder).folders) {
                    if (AddonNaming.isUniqueForm(folder)) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "Structures subfolder " + folder + " is not in creatorshortname_projectshortname form",
                            AddonPackFolders.folderPath(pack, typeFolder, folder),
                            pack.root
                        )
                    );
                }
            }
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";
import AddonNaming from "./AddonNaming.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class CreatorFolderTooManySubfolders extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.CREATOR_FOLDER_TOO_MANY_SUBFOLDERS,
        slug: "creator-folder-too-many-subfolders",
        severity: "error",
        description: "Creator folder not in creatorshortname_projectshortname form has more than one subfolder",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const { typeFolder, creatorFolder } of AddonPackFolders.creatorFolders(pack)) {
                if (AddonNaming.isUniqueForm(creatorFolder)) {
                    continue;
                }

                const projectFolders = AddonPackFolders.children(pack, typeFolder + "/" + creatorFolder).folders.filter(
                    (folder) => folder.toLowerCase() !== AddonLimits.COMMON_FOLDER
                );

                if (projectFolders.length <= 1) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Creator folder " +
                            typeFolder +
                            "/" +
                            creatorFolder +
                            " has " +
                            projectFolders.length +
                            " subfolders besides common, expected one",
                        AddonPackFolders.folderPath(pack, typeFolder, creatorFolder),
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}

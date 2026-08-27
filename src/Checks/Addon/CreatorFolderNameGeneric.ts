import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import GenericTerms from "../../Data/GenericTerms.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class CreatorFolderNameGeneric extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.CREATOR_FOLDER_NAME_GENERIC,
        slug: "creator-folder-name-generic",
        severity: "error",
        description: "Creator folder name is a generic term",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const { typeFolder, creatorFolder } of AddonPackFolders.creatorFolders(pack)) {
                const creatorName = AddonNaming.isUniqueForm(creatorFolder) ? AddonNaming.firstToken(creatorFolder) : creatorFolder;

                if (!GenericTerms.isGeneric(creatorName)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Creator folder name " + creatorName + " is a generic term, expected the creator short name",
                        AddonPackFolders.folderPath(pack, typeFolder, creatorFolder),
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}

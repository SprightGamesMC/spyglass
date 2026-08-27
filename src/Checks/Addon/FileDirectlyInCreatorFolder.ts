import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class FileDirectlyInCreatorFolder extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.FILE_DIRECTLY_IN_CREATOR_FOLDER,
        slug: "file-directly-in-creator-folder",
        severity: "error",
        description: "File directly inside a creator folder that is not in creatorshortname_projectshortname form",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const { typeFolder, creatorFolder } of AddonPackFolders.creatorFolders(pack)) {
                if (AddonNaming.isUniqueForm(creatorFolder)) {
                    continue;
                }

                for (const file of AddonPackFolders.children(pack, typeFolder + "/" + creatorFolder).files) {
                    findings.push(
                        this.finding(
                            "File is directly in " +
                                typeFolder +
                                "/" +
                                creatorFolder +
                                ", expected a projectshortname folder below the creator folder",
                            file.path,
                            pack.root
                        )
                    );
                }
            }
        }

        return findings;
    }
}

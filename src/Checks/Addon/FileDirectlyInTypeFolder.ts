import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class FileDirectlyInTypeFolder extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.FILE_DIRECTLY_IN_TYPE_FOLDER,
        slug: "file-directly-in-type-folder",
        severity: "error",
        description: "File directly inside a type folder",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const typeFolder of AddonPackFolders.typeFolders(pack)) {
                if (!AddonPackFolders.isScannedTypeFolder(pack, typeFolder)) {
                    continue;
                }

                for (const file of AddonPackFolders.children(pack, typeFolder).files) {
                    if (AddonPackFolders.isCatalogFile(typeFolder, file.path)) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "File is directly in " + typeFolder + ", expected " + typeFolder + "/creatorshortname_projectshortname/",
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

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class StructuresTooManySubfolders extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.STRUCTURES_TOO_MANY_SUBFOLDERS,
        slug: "structures-too-many-subfolders",
        severity: "error",
        description: "structures folder has more than one direct subfolder",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const typeFolder of AddonPackFolders.typeFolders(pack)) {
                if (!AddonPackFolders.isStructuresFolder(typeFolder)) {
                    continue;
                }

                const folders = AddonPackFolders.children(pack, typeFolder).folders;

                if (folders.length <= 1) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Structures folder has " + folders.length + " subfolders, expected one named creatorshortname_projectshortname",
                        AddonPackFolders.folderPath(pack, typeFolder),
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}

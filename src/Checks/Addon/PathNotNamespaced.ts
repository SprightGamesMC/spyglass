import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import GenericTerms from "../../Data/GenericTerms.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonNaming from "./AddonNaming.js";
import AddonPackFolders from "./AddonPackFolders.js";

export default class PathNotNamespaced extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.PATH_NOT_NAMESPACED,
        slug: "path-not-namespaced",
        severity: "error",
        description: "Function, loot table, trade table, texture, sound, or structure path is not under a namespaced folder",
    };

    private static isNestedCreatorFolder(pack: Pack, typeFolder: string, folder: string): boolean {
        if (AddonPackFolders.isStructuresFolder(typeFolder)) {
            return false;
        }

        if (GenericTerms.isGeneric(folder)) {
            return false;
        }

        return AddonPackFolders.children(pack, typeFolder + "/" + folder).folders.length > 0;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const typeFolder of AddonPackFolders.typeFolders(pack)) {
                if (!AddonPackFolders.isNamespacedPathFolder(typeFolder)) {
                    continue;
                }

                for (const folder of AddonPackFolders.children(pack, typeFolder).folders) {
                    if (AddonNaming.isUniqueForm(folder)) {
                        continue;
                    }

                    if (PathNotNamespaced.isNestedCreatorFolder(pack, typeFolder, folder)) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "Folder " +
                                typeFolder +
                                "/" +
                                folder +
                                " is not namespaced, expected creatorshortname_projectshortname or creatorshortname/projectshortname",
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

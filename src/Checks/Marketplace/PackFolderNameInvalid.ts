import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";

export default class PackFolderNameInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PACK_FOLDER_NAME_INVALID,
        slug: "pack-folder-name-invalid",
        severity: "error",
        description: "Pack folder name is not BP_ or RP_ followed by the acronym",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const packs = context.model.packs.filter((pack) => MarketplaceFolders.expectedPrefix(pack) !== undefined);

        for (const pack of packs) {
            const finding = this.checkName(pack) ?? this.checkParent(pack);

            if (finding !== undefined) {
                findings.push(finding);
            }
        }

        return findings;
    }

    private checkName(pack: Pack): Finding | undefined {
        if (MarketplaceFolders.acronym(pack) !== undefined) {
            return undefined;
        }

        const prefix = MarketplaceFolders.expectedPrefix(pack) ?? "";
        const name = MarketplaceFolders.folderName(pack);

        return this.finding(
            "Pack folder " + name + " is not " + prefix + " followed by an acronym of letters, digits, underscore, hyphen",
            pack.root,
            pack.root
        );
    }

    private checkParent(pack: Pack): Finding | undefined {
        const expectedParent = MarketplaceFolders.expectedParentFolder(pack) ?? "";

        if (MarketplaceFolders.parentFolderName(pack) === expectedParent) {
            return undefined;
        }

        return this.finding("Pack folder " + pack.root + " is not inside a " + expectedParent + " folder", pack.root, pack.root);
    }
}

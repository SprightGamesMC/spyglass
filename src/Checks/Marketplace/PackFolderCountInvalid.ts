import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class PackFolderCountInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PACK_FOLDER_COUNT_INVALID,
        slug: "pack-folder-count-invalid",
        severity: "error",
        description: "More than one pack folder under behavior_packs or resource_packs",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const byParent = new Map<string, Pack[]>();

        for (const pack of context.model.packs) {
            if (MarketplaceFolders.expectedPrefix(pack) === undefined) {
                continue;
            }

            const parent = PathUtilities.directory(pack.root);
            const group = byParent.get(parent) ?? [];

            group.push(pack);
            byParent.set(parent, group);
        }

        const findings: Finding[] = [];

        for (const [parent, group] of byParent) {
            if (group.length <= MarketplaceLimits.PACKS_PER_FOLDER) {
                continue;
            }

            for (const pack of group) {
                findings.push(
                    this.finding(
                        "Folder " + parent + " contains " + group.length + " packs, expected " + MarketplaceLimits.PACKS_PER_FOLDER,
                        pack.root,
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}

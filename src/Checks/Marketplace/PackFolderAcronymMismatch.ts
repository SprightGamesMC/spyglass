import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceFolders from "./MarketplaceFolders.js";

export default class PackFolderAcronymMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PACK_FOLDER_ACRONYM_MISMATCH,
        slug: "pack-folder-acronym-mismatch",
        severity: "error",
        description: "Behavior pack and resource pack folders use different acronyms",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const behaviorAcronyms = context.model.packs
            .filter((pack) => pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE)
            .map((pack) => MarketplaceFolders.acronym(pack))
            .filter((acronym): acronym is string => acronym !== undefined);

        if (behaviorAcronyms.length === 0) {
            return [];
        }

        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            const acronym = MarketplaceFolders.acronym(pack);

            if (acronym === undefined || behaviorAcronyms.includes(acronym)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack folder uses acronym " + acronym + ", behavior pack folder uses " + behaviorAcronyms.join(", "),
                    pack.root,
                    pack.root
                )
            );
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";

export default class BehaviorPackHasPackScope extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.BEHAVIOR_PACK_HAS_PACK_SCOPE,
        slug: "behavior-pack-has-pack-scope",
        severity: "error",
        description: "Add-on behavior pack manifest declares pack_scope",
        contentTypes: ["addon"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.BEHAVIOR_PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);
            const packScope = JsonLoader.get(manifest, "header", "pack_scope");

            if (packScope === undefined) {
                continue;
            }

            findings.push(
                this.finding(
                    "Behavior pack manifest declares header.pack_scope " + JSON.stringify(packScope) + ", expected no pack_scope",
                    pack.manifestPath,
                    pack.root,
                    { field: "header.pack_scope" }
                )
            );
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import BlockChecks from "./BlockChecks.js";
import BlockLimits from "./BlockLimits.js";

export default class DeprecatedOverride extends Check {
    readonly definition: CheckDefinition = {
        group: BlockChecks.GROUP,
        number: BlockChecks.DEPRECATED_OVERRIDE,
        slug: "deprecated-override",
        severity: "warning",
        description: "blocks.json defines a deprecated vanilla block",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, BlockLimits.CATALOG_KINDS)) {
            const catalog = await context.loaders.json.readObject(item.path);

            if (catalog === undefined) {
                continue;
            }

            for (const key of BlockLimits.DEPRECATED_OVERRIDE_KEYS) {
                if (catalog[key] === undefined) {
                    continue;
                }

                findings.push(this.finding("blocks.json defines deprecated vanilla block " + key, item.path, pack.root, { field: key }));
            }
        }

        return findings;
    }
}

import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import PackVersionComparer from "./PackVersionComparer.js";

export default class MinEngineVersionsDiffer extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.MIN_ENGINE_VERSIONS_DIFFER,
        slug: "min-engine-versions-differ",
        severity: "error",
        description: "Pack manifests in one submission have different min_engine_version values",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const packs = PackItemLoader.contentPacks(context.model);
        const versions = await PackVersionComparer.collect(context.loaders, packs, "header.min_engine_version");

        return PackVersionComparer.differences(versions).map((difference) =>
            this.finding(difference.message, difference.pack.manifestPath, difference.pack.root, { field: "header.min_engine_version" })
        );
    }
}

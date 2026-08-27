import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import PackVersionComparer from "./PackVersionComparer.js";

export default class PackVersionsDiffer extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PACK_VERSIONS_DIFFER,
        slug: "pack-versions-differ",
        severity: "error",
        description: "Pack manifests in one submission have different header versions",
        excludedContentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const packs = context.model.packs.filter((pack) => pack.type !== "unknown");
        const versions = await PackVersionComparer.collect(context.loaders, packs, "header.version");

        return PackVersionComparer.differences(versions).map((difference) =>
            this.finding(difference.message, difference.pack.manifestPath, difference.pack.root, { field: "header.version" })
        );
    }
}

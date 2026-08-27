import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentItem, Pack } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class MultipleManifests extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.MULTIPLE_MANIFESTS,
        slug: "multiple-manifests",
        severity: "error",
        description: "More than one manifest.json inside one pack",
    };

    private static isOwnManifest(pack: Pack, item: ContentItem): boolean {
        if (PathUtilities.fileName(item.packPath).toLowerCase() !== PackLimits.MANIFEST_NAME) {
            return false;
        }

        if (pack.type !== PackItemLoader.WORLD_TEMPLATE_PACK_TYPE) {
            return true;
        }

        return !PackLimits.PACK_CONTAINER_FOLDERS.includes(PathUtilities.firstSegment(item.packPath).toLowerCase());
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const manifests = pack.items.filter((item) => MultipleManifests.isOwnManifest(pack, item));

            if (manifests.length < 2) {
                continue;
            }

            const listed = manifests.map((item) => item.packPath).join(", ");

            findings.push(this.finding("Pack has " + manifests.length + " manifest files: " + listed, pack.manifestPath, pack.root));
        }

        return findings;
    }
}

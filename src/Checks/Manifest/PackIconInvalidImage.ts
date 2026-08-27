import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PackIconInvalidImage extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PACK_ICON_INVALID_IMAGE,
        slug: "pack-icon-invalid-image",
        severity: "error",
        description: "pack_icon.png cannot be decoded",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, ManifestLimits.PACK_ICON_KINDS)) {
            const image = await context.loaders.image.read(item.path);

            if (image.status === "ok") {
                continue;
            }

            findings.push(this.finding("Pack icon " + item.packPath + " cannot be decoded as an image", item.path, pack.root));
        }

        return findings;
    }
}

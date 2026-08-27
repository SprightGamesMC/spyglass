import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PackIconInvalidSize extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PACK_ICON_INVALID_SIZE,
        slug: "pack-icon-invalid-size",
        severity: "error",
        description:
            "pack_icon.png not a square power of two from " +
            ManifestLimits.PACK_ICON_MIN_SIDE +
            " to " +
            ManifestLimits.PACK_ICON_MAX_SIDE,
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, ManifestLimits.PACK_ICON_KINDS)) {
            const image = await context.loaders.image.read(item.path);

            if (image.status !== "ok") {
                continue;
            }

            const { width, height } = image.metadata;

            if (width === height && ManifestLimits.PACK_ICON_SIDES.includes(width)) {
                continue;
            }

            const message =
                "Pack icon " +
                item.packPath +
                " is " +
                width +
                " by " +
                height +
                ", expected a square of " +
                ManifestLimits.PACK_ICON_SIDES.join(", ");

            findings.push(this.finding(message, item.path, pack.root));
        }

        return findings;
    }
}

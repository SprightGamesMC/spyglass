import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import TextureHandleLoader from "../../Loaders/TextureHandleLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class TooManyTextureHandles extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.TOO_MANY_TEXTURE_HANDLES,
        slug: "too-many-texture-handles",
        severity: "error",
        description: "More than " + AddonLimits.TEXTURE_HANDLE_LIMIT + " texture handles",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            const handles = await TextureHandleLoader.forPack(context, pack);

            if (handles.size <= AddonLimits.TEXTURE_HANDLE_LIMIT) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack references " + handles.size + " texture handles, limit is " + AddonLimits.TEXTURE_HANDLE_LIMIT,
                    pack.manifestPath,
                    pack.root
                )
            );
        }

        return findings;
    }
}

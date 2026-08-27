import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentItem } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import SubpackFormat from "../../Loaders/SubpackFormat.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class VanillaContentOverride extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.VANILLA_CONTENT_OVERRIDE,
        slug: "vanilla-content-override",
        severity: "error",
        description: "File is at the path of a vanilla file",
    };

    private static isAllowed(packPath: string): boolean {
        if (AddonLimits.VANILLA_OVERRIDE_ALLOWED_PATHS.includes(packPath)) {
            return true;
        }

        if (AddonLimits.VANILLA_OVERRIDE_ALLOWED_EXTENSIONS.includes(PathUtilities.extension(packPath))) {
            return true;
        }

        return AddonLimits.VANILLA_OVERRIDE_ALLOWED_FOLDERS.includes(PathUtilities.firstSegment(packPath));
    }

    private static isVanillaPath(context: CheckContext, item: ContentItem, packPath: string): boolean {
        if (item.kind === "texture") {
            return context.loaders.vanilla.hasTexturePath(PathUtilities.withoutExtension(packPath));
        }

        return context.loaders.vanilla.hasPath(packPath);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            for (const item of pack.items) {
                const packPath = SubpackFormat.pathWithoutSubpack(item.packPath).toLowerCase();

                if (VanillaContentOverride.isAllowed(packPath) || !VanillaContentOverride.isVanillaPath(context, item, packPath)) {
                    continue;
                }

                findings.push(this.finding("File " + item.packPath + " overrides the vanilla file " + packPath, item.path, pack.root));
            }
        }

        return findings;
    }
}

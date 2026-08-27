import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PbrCapabilityMissing extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PBR_CAPABILITY_MISSING,
        slug: "pbr-capability-missing",
        severity: "error",
        description: "Pack has Vibrant Visuals files but no pbr capability",
    };

    protected async checkManifest(context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
            return [];
        }

        const hasPbr = ManifestLoader.hasCapability(manifest, ManifestLimits.PBR_CAPABILITY);

        if (hasPbr) {
            return [];
        }

        const files = await this.findVibrantVisualsFiles(context, pack);

        if (files.length === 0) {
            return [];
        }

        const message = "Pack has " + files.length + " Vibrant Visuals texture set file(s) such as " + files[0] + " but no pbr capability";

        return [this.manifestFinding(pack, message, "capabilities")];
    }

    private async findVibrantVisualsFiles(context: CheckContext, pack: Pack): Promise<string[]> {
        const files: string[] = [];

        for (const item of pack.items) {
            if (item.kind !== "texture_set") {
                continue;
            }

            const textureSet = await context.loaders.json.readObject(item.path);
            const layers = JsonLoader.get(textureSet, ManifestLimits.TEXTURE_SET_KEY);

            if (!JsonLoader.isObject(layers)) {
                continue;
            }

            if (ManifestLimits.VIBRANT_VISUALS_LAYERS.some((layer) => layers[layer] !== undefined)) {
                files.push(item.packPath);
            }
        }

        return files;
    }
}

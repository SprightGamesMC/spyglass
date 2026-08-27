import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class MinEngineVersionTooHighForFormat1 extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MIN_ENGINE_VERSION_TOO_HIGH_FOR_FORMAT_1,
        slug: "min-engine-version-too-high-for-format-1",
        severity: "error",
        description:
            "format_version 1 with min_engine_version " +
            VersionUtilities.format(ManifestLimits.FORMAT_1_MIN_ENGINE_VERSION_LIMIT) +
            " or higher",
    };

    protected async checkManifest(context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
            return [];
        }

        const formatVersion = ManifestLoader.formatVersion(manifest);
        const minEngineVersion = ManifestLoader.minEngineVersion(manifest);

        if (formatVersion === undefined || formatVersion >= ManifestLimits.FORMAT_VERSION_2 || minEngineVersion === undefined) {
            return [];
        }

        const limit = this.isInEducationWorld(context, pack)
            ? ManifestLimits.FORMAT_1_MIN_ENGINE_VERSION_LIMIT_EDUCATION
            : ManifestLimits.FORMAT_1_MIN_ENGINE_VERSION_LIMIT;

        if (VersionUtilities.compare(minEngineVersion, limit) < 0) {
            return [];
        }

        const message =
            "min_engine_version " +
            VersionUtilities.format(minEngineVersion) +
            " requires format_version " +
            ManifestLimits.FORMAT_VERSION_2 +
            " from " +
            VersionUtilities.format(limit);

        return [this.manifestFinding(pack, message, "header.min_engine_version")];
    }

    private isInEducationWorld(context: CheckContext, pack: Pack): boolean {
        return context.model.worlds.some(
            (world) => PathUtilities.isInside(pack.root, world.root) && world.items.some((item) => item.kind === "education")
        );
    }
}

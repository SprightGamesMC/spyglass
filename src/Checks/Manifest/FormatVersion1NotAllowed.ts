import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class FormatVersion1NotAllowed extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.FORMAT_VERSION_1_NOT_ALLOWED,
        slug: "format-version-1-not-allowed",
        severity: "error",
        description: "Behavior, resource, or world template manifest uses format_version 1",
        excludedContentTypes: ["skin", "persona"],
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (!ManifestLimits.FORMAT_1_RESTRICTED_PACK_TYPES.includes(pack.type)) {
            return [];
        }

        const formatVersion = ManifestLoader.formatVersion(manifest);

        if (formatVersion === undefined || formatVersion >= ManifestLimits.FORMAT_VERSION_2) {
            return [];
        }

        const message =
            "format_version " + formatVersion + " is not allowed for a " + pack.type + " pack, use " + ManifestLimits.FORMAT_VERSION_2;

        return [this.manifestFinding(pack, message, "format_version")];
    }
}

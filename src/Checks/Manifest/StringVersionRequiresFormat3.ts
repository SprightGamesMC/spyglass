import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class StringVersionRequiresFormat3 extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.STRING_VERSION_REQUIRES_FORMAT_3,
        slug: "string-version-requires-format-3",
        severity: "error",
        description: "Version field is a string with format_version below 3",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const formatVersion = ManifestLoader.formatVersion(manifest);

        if (formatVersion === undefined || formatVersion >= ManifestLimits.FORMAT_VERSION_3) {
            return [];
        }

        const fields = new Map<string, unknown>();

        fields.set("header.version", JsonLoader.get(manifest, "header", "version"));
        fields.set("header.min_engine_version", JsonLoader.get(manifest, "header", "min_engine_version"));
        ManifestLoader.modules(manifest).forEach((module, index) => fields.set("modules[" + index + "].version", module.version));
        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            if (ManifestLoader.hasDependencyModuleName(dependency)) {
                return;
            }

            fields.set("dependencies[" + index + "].version", dependency.version);
        });

        const findings: Finding[] = [];

        for (const [field, value] of fields) {
            if (typeof value !== "string") {
                continue;
            }

            const message =
                field +
                " is the string " +
                JSON.stringify(value) +
                " but format_version " +
                formatVersion +
                " needs an array, strings need format_version " +
                ManifestLimits.FORMAT_VERSION_3;

            findings.push(this.manifestFinding(pack, message, field));
        }

        return findings;
    }
}

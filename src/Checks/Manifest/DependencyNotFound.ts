import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestStructureLoader from "../../Loaders/ManifestStructureLoader.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class DependencyNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.DEPENDENCY_NOT_FOUND,
        slug: "dependency-not-found",
        severity: "error",
        description: "Dependency uuid does not match any pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const manifests = new Map<Pack, JsonObject>();

        for (const pack of context.model.packs) {
            const manifest = await ManifestStructureLoader.read(context.loaders, pack);

            if (manifest !== undefined) {
                manifests.set(pack, manifest);
            }
        }

        const known = new Set<string>();

        for (const manifest of manifests.values()) {
            const uuid = ManifestLoader.headerUuid(manifest);

            if (ManifestLoader.isValidUuid(uuid)) {
                known.add(uuid.toLowerCase());
            }
        }

        const findings: Finding[] = [];

        for (const [pack, manifest] of manifests) {
            if (!ManifestLimits.DEPENDENCY_CHECKED_PACK_TYPES.includes(pack.type)) {
                continue;
            }

            findings.push(...this.checkDependencies(pack, manifest, known));
        }

        return findings;
    }

    private checkDependencies(pack: Pack, manifest: JsonObject, known: ReadonlySet<string>): Finding[] {
        const findings: Finding[] = [];

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            const uuid = dependency.uuid;

            if (!ManifestLoader.isValidUuid(uuid) || known.has(uuid.toLowerCase())) {
                return;
            }

            if (Object.hasOwn(ManifestLimits.SCRIPT_MODULE_UUIDS, uuid.toLowerCase())) {
                return;
            }

            const field = "dependencies[" + index + "].uuid";
            const message = "Dependency uuid " + uuid + " does not match the header uuid of any pack in the input";

            findings.push(this.finding(message, pack.manifestPath, pack.root, { field }));
        });

        return findings;
    }
}

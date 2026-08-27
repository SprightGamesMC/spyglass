import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentModel } from "../../Types/ModelTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class ManifestMissing extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.MANIFEST_MISSING,
        slug: "manifest-missing",
        severity: "error",
        description: "Pack folder has no manifest.json",
    };

    private static candidateFolders(model: ContentModel): string[] {
        const folders = new Set<string>();

        for (const file of model.filesOutsidePacks) {
            const candidate = ManifestMissing.packFolderOf(file.path);

            if (candidate !== undefined) {
                folders.add(candidate);
            }
        }

        return [...folders].sort();
    }

    private static packFolderOf(path: string): string | undefined {
        const segments = PathUtilities.segments(path);

        for (let index = 0; index < segments.length - 1; index++) {
            const lower = segments[index].toLowerCase();

            if (PackLimits.PACK_CONTAINER_FOLDERS.includes(lower) && index + 2 < segments.length) {
                return segments.slice(0, index + 2).join("/");
            }

            if (PackLimits.SINGLE_PACK_FOLDERS.includes(lower)) {
                return segments.slice(0, index + 1).join("/");
            }
        }

        return undefined;
    }

    private static hasManifest(model: ContentModel, folder: string): boolean {
        if (model.packs.some((pack) => pack.root === folder)) {
            return true;
        }

        return model.allFiles.some(
            (file) =>
                PathUtilities.directory(file.path) === folder &&
                PathUtilities.fileName(file.path).toLowerCase() === PackLimits.MANIFEST_NAME
        );
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const model = context.model;
        const findings: Finding[] = [];

        for (const folder of ManifestMissing.candidateFolders(model)) {
            if (ManifestMissing.hasManifest(model, folder)) {
                continue;
            }

            findings.push(this.finding("Pack folder " + folder + " has no manifest.json", folder));
        }

        const nothingFound = findings.length === 0 && model.packs.length === 0 && model.worlds.length === 0;

        if (nothingFound) {
            return [this.finding("No manifest.json found anywhere in the content")];
        }

        return findings;
    }
}

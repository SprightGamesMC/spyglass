import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class ArchiveFolderNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.ARCHIVE_FOLDER_NOT_ALLOWED,
        slug: "archive-folder-not-allowed",
        severity: "error",
        description: "__brarchive folder inside the submission",
    };

    private static archiveFolder(path: string): string | undefined {
        const segments = PathUtilities.segments(path);
        const index = segments.findIndex((segment) => segment.toLowerCase() === MarketplaceLimits.ARCHIVE_FOLDER);

        return index < 0 ? undefined : segments.slice(0, index + 1).join("/");
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const reported = new Set<string>();

        for (const file of context.model.allFiles) {
            const folder = ArchiveFolderNotAllowed.archiveFolder(file.path);

            if (folder === undefined || reported.has(folder)) {
                continue;
            }

            reported.add(folder);

            const pack = context.model.packs.find((candidate) => PathUtilities.isInside(folder, candidate.root));

            findings.push(
                this.finding(
                    "Folder " + folder + " is an archive folder and cannot be part of a submission",
                    folder,
                    pack === undefined ? undefined : pack.root
                )
            );
        }

        return findings;
    }
}

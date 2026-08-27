import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SubpackFormat from "../../Loaders/SubpackFormat.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class FileNameBlocked extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.FILE_NAME_BLOCKED,
        slug: "file-name-blocked",
        severity: "error",
        description: "File name is reserved by the game",
    };

    private static matches(packPath: string, entry: string): boolean {
        const lowerPath = packPath.toLowerCase();
        const lowerEntry = entry.toLowerCase();

        if (lowerEntry.startsWith("/")) {
            const rootEntry = lowerEntry.slice(1);

            return lowerPath === rootEntry || lowerPath.startsWith(rootEntry + "/");
        }

        if (lowerEntry.includes("/")) {
            return lowerPath === lowerEntry;
        }

        return PathUtilities.fileName(lowerPath) === lowerEntry;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const blocked = PackLimits.BLOCKED_PATHS[pack.type];

            if (blocked === undefined) {
                continue;
            }

            for (const item of pack.items) {
                const packPath = SubpackFormat.pathWithoutSubpack(item.packPath);
                const match = blocked.find((entry) => FileNameBlocked.matches(packPath, entry));

                if (match === undefined) {
                    continue;
                }

                findings.push(this.finding("File " + item.packPath + " matches the blocked name " + match, item.path, pack.root));
            }
        }

        return findings;
    }
}

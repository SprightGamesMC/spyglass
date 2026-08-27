import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class ExtensionNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.EXTENSION_NOT_ALLOWED,
        slug: "extension-not-allowed",
        severity: "error",
        description: "File extension not allowed for the pack type",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const allowed = PackLimits.ALLOWED_EXTENSIONS[pack.type];

            if (allowed === undefined) {
                continue;
            }

            for (const item of pack.items) {
                const extension = PathUtilities.extension(item.path);

                if (allowed.includes(extension)) {
                    continue;
                }

                const shown = extension === "" ? "no extension" : "extension " + extension;

                findings.push(
                    this.finding(shown + " is not allowed in a " + pack.type + " pack, allowed: " + allowed.join(" "), item.path, pack.root)
                );
            }
        }

        return findings;
    }
}

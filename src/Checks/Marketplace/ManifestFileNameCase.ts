import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default class ManifestFileNameCase extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.MANIFEST_FILE_NAME_CASE,
        slug: "manifest-file-name-case",
        severity: "error",
        description: "Manifest file name is not exactly manifest.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.allFiles) {
            const name = PathUtilities.fileName(file.path);

            if (name === MarketplaceLimits.MANIFEST_NAME || name.toLowerCase() !== MarketplaceLimits.MANIFEST_NAME) {
                continue;
            }

            const pack = context.model.packs.find((candidate) => PathUtilities.isInside(file.path, candidate.root));

            findings.push(
                this.finding("Manifest file is named " + name + ", expected " + MarketplaceLimits.MANIFEST_NAME, file.path, pack?.root)
            );
        }

        return findings;
    }
}

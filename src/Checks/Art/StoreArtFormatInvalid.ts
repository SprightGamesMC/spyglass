import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";

export default class StoreArtFormatInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.STORE_ART_FORMAT_INVALID,
        slug: "store-art-format-invalid",
        severity: "error",
        description: "Store Art file is not JPEG",
        excludedContentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.art) {
            if (file.folder !== ArtLimits.STORE_FOLDER) {
                continue;
            }

            const result = await context.loaders.image.read(file.path);

            if (result.status === "unreadable" || result.metadata?.format === ArtLimits.STORE_FORMAT) {
                continue;
            }

            const actual = result.metadata?.format ?? "not an image";

            findings.push(this.finding("Format is " + actual + ", expected " + ArtLimits.STORE_FORMAT, file.path));
        }

        return findings;
    }
}

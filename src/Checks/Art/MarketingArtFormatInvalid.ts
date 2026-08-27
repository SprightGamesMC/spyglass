import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtLimits from "./ArtLimits.js";

export default class MarketingArtFormatInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.MARKETING_ART_FORMAT_INVALID,
        slug: "marketing-art-format-invalid",
        severity: "error",
        description: "Marketing Art file is not JPEG or PSD",
        excludedContentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.art) {
            if (file.folder !== ArtLimits.MARKETING_FOLDER) {
                continue;
            }

            const result = await context.loaders.image.read(file.path);
            const format = result.metadata?.format;

            if (result.status === "unreadable" || (format !== undefined && ArtLimits.MARKETING_FORMATS.includes(format))) {
                continue;
            }

            const actual = format ?? "not an image";

            findings.push(this.finding("Format is " + actual + ", expected " + ArtLimits.MARKETING_FORMATS.join(" or "), file.path));
        }

        return findings;
    }
}

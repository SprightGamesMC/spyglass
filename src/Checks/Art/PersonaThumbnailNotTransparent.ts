import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtImages from "./ArtImages.js";
import ArtLimits from "./ArtLimits.js";

export default class PersonaThumbnailNotTransparent extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.PERSONA_THUMBNAIL_NOT_TRANSPARENT,
        slug: "persona-thumbnail-not-transparent",
        severity: "error",
        description: "Persona thumbnail has no alpha channel",
        contentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of ArtFileRoles.withRole(context.model, "thumbnail")) {
            const metadata = await ArtImages.read(context.loaders, entry.file);

            if (metadata === undefined || metadata.format !== ArtLimits.PERSONA_IMAGE_FORMAT || metadata.hasAlpha) {
                continue;
            }

            findings.push(this.finding("Thumbnail has no alpha channel, expected a transparent PNG", entry.file.path));
        }

        return findings;
    }
}

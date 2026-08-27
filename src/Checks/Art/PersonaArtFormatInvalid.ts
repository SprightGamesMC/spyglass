import type { ArtRole } from "../../Types/ArtTypes.js";
import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class PersonaArtFormatInvalid extends Check {
    static readonly EXPECTED_FORMATS: Readonly<Partial<Record<ArtRole, string>>> = {
        thumbnail: ArtLimits.PERSONA_IMAGE_FORMAT,
        approval_sheet: ArtLimits.PERSONA_IMAGE_FORMAT,
        walk_cycle_gif: ArtLimits.PERSONA_PREVIEW_FORMAT,
        preview_gif: ArtLimits.PERSONA_PREVIEW_FORMAT,
    };

    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.PERSONA_ART_FORMAT_INVALID,
        slug: "persona-art-format-invalid",
        severity: "error",
        description: "Persona thumbnail or approval sheet is not PNG, or preview is not GIF",
        contentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of ArtFileRoles.classifyAll(context.model)) {
            const expected = PersonaArtFormatInvalid.EXPECTED_FORMATS[entry.role];

            if (expected === undefined) {
                continue;
            }

            const result = await context.loaders.image.read(entry.file.path);

            if (result.status === "unreadable" || result.metadata?.format === expected) {
                continue;
            }

            const actual = result.metadata?.format ?? "not an image";

            findings.push(this.finding("Format is " + actual + ", expected " + expected, entry.file.path));
        }

        return findings;
    }
}

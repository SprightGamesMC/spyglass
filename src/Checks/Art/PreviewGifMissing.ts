import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaIdentifierLoader from "../../Loaders/PersonaIdentifierLoader.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class PreviewGifMissing extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.PREVIEW_GIF_MISSING,
        slug: "preview-gif-missing",
        severity: "error",
        description: "A required preview GIF is absent",
        contentTypes: ["persona"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const identity = await PersonaIdentifierLoader.load(context);

        if (ArtFileRoles.nameKind(identity) === "emote") {
            return this.checkEmotePreview(context);
        }

        return this.checkWalkCycles(context);
    }

    private checkEmotePreview(context: CheckContext): Finding[] {
        if (ArtFileRoles.withRole(context.model, "preview_gif").length > 0) {
            return [];
        }

        return [
            this.finding(
                "No id." + ArtLimits.GIF_EXTENSION + " preview file in " + ArtLimits.MARKETING_FOLDER + " for an emote",
                ArtLimits.MARKETING_FOLDER
            ),
        ];
    }

    private checkWalkCycles(context: CheckContext): Finding[] {
        const present = new Set(ArtFileRoles.withRole(context.model, "walk_cycle_gif").map((entry) => entry.variant));
        const findings: Finding[] = [];

        for (const variant of ArtLimits.WALK_CYCLE_VARIANTS) {
            if (present.has(variant)) {
                continue;
            }

            findings.push(
                this.finding(
                    "No id_" + variant + "." + ArtLimits.GIF_EXTENSION + " file in " + ArtLimits.MARKETING_FOLDER + " for a persona piece",
                    ArtLimits.MARKETING_FOLDER
                )
            );
        }

        return findings;
    }
}

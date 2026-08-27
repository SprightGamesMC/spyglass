import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaIdentifierLoader from "../../Loaders/PersonaIdentifierLoader.js";
import Check from "../Check.js";
import ArtChecks from "./ArtChecks.js";
import ArtFileRoles from "./ArtFileRoles.js";
import ArtLimits from "./ArtLimits.js";

export default class FileNameInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: ArtChecks.GROUP,
        number: ArtChecks.FILE_NAME_INVALID,
        slug: "file-name-invalid",
        severity: "error",
        description: "File in Store Art or Marketing Art does not match an expected name",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const identity = await PersonaIdentifierLoader.load(context);
        const kind = ArtFileRoles.nameKind(identity);
        const patterns = ArtLimits.namesFor(kind);
        const findings: Finding[] = [];

        for (const file of context.model.art) {
            const expected = file.folder === ArtLimits.STORE_FOLDER ? patterns.store : patterns.marketing;

            if (expected.some((pattern) => pattern.test(file.name))) {
                continue;
            }

            findings.push(
                this.finding("File name " + file.name + " matches no expected " + file.folder + " name for " + kind + " content", file.path)
            );
        }

        return findings;
    }
}

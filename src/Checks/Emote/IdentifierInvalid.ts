import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class IdentifierInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.IDENTIFIER_INVALID,
        slug: "identifier-invalid",
        severity: "error",
        description: "Identifier is not lower case letters, digits, underscore, starting with em_ and containing a studio prefix",
    };

    private static problem(pieceName: string): string | undefined {
        if (!EmoteLimits.IDENTIFIER_PATTERN.test(pieceName)) {
            return "has characters outside lower case letters, digits, and underscore";
        }

        if (!pieceName.startsWith(EmoteLimits.IDENTIFIER_PREFIX)) {
            return "does not start with " + EmoteLimits.IDENTIFIER_PREFIX;
        }

        const rest = pieceName.slice(EmoteLimits.IDENTIFIER_PREFIX.length);
        const separator = rest.indexOf(EmoteLimits.STUDIO_SEPARATOR);

        if (separator <= 0 || separator === rest.length - 1) {
            return "has no studio prefix after " + EmoteLimits.IDENTIFIER_PREFIX + ", expected em_<studio>_<name>";
        }

        return undefined;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const pieceName = PersonaLoader.string(data.meta, "piece_name");

            if (pieceName === undefined || data.metaPath === undefined) {
                continue;
            }

            const problem = IdentifierInvalid.problem(pieceName);

            if (problem === undefined) {
                continue;
            }

            findings.push(this.finding("piece_name " + pieceName + " " + problem, data.metaPath, data.pack.root, { field: "piece_name" }));
        }

        return findings;
    }
}

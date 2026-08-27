import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class IdentifierInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.IDENTIFIER_INVALID,
        slug: "identifier-invalid",
        severity: "error",
        description: "Piece identifier has characters outside letters, digits, underscore, period, hyphen, or ends in a period",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const pieceName = PersonaLoader.string(data.meta, "piece_name");

            if (pieceName === undefined || data.metaPath === undefined) {
                continue;
            }

            if (!PersonaLimits.IDENTIFIER_PATTERN.test(pieceName)) {
                findings.push(
                    this.finding(
                        "piece_name " + pieceName + " has characters outside letters, digits, underscore, period, and hyphen",
                        data.metaPath,
                        data.pack.root,
                        { field: "piece_name" }
                    )
                );
                continue;
            }

            if (pieceName.endsWith(PersonaLimits.IDENTIFIER_FORBIDDEN_ENDING)) {
                findings.push(
                    this.finding("piece_name " + pieceName + " ends in a period", data.metaPath, data.pack.root, { field: "piece_name" })
                );
            }
        }

        return findings;
    }
}

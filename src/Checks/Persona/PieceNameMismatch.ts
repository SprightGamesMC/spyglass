import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class PieceNameMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.PIECE_NAME_MISMATCH,
        slug: "piece-name-mismatch",
        severity: "error",
        description: "piece_name differs from the meta file name without the extension",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const pieceName = PersonaLoader.string(data.meta, "piece_name");

            if (pieceName === undefined || data.metaPath === undefined) {
                continue;
            }

            const nameWithoutExtension = PersonaLoader.metaNameWithoutExtension(data.metaPath);

            if (pieceName === nameWithoutExtension) {
                continue;
            }

            findings.push(
                this.finding(
                    "piece_name " + pieceName + " differs from the meta file name without the extension " + nameWithoutExtension,
                    data.metaPath,
                    data.pack.root,
                    {
                        field: "piece_name",
                    }
                )
            );
        }

        return findings;
    }
}

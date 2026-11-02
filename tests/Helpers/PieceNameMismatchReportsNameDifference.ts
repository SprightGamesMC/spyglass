import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { PieceNameMismatchReportsNameDifferenceCase } from "../Types/PieceNameMismatchReportsNameDifferenceTypes.js";
import PieceNameMismatch from "../../src/Checks/Persona/PieceNameMismatch.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class PieceNameMismatchReportsNameDifference {
    static readonly ID = "PERSONA/203";
    static readonly CASES: readonly PieceNameMismatchReportsNameDifferenceCase[] = [
        {
            name: "piece_name equal to the meta file name without the extension matches",
            files: PersonaFixture.pieceFiles({}),
            expectedIds: [],
        },
        {
            name: "piece_name other_name differs from the meta file name without the extension",
            files: PersonaFixture.pieceFiles({ metaName: "other_name" }),
            expectedIds: ["PERSONA/203"],
            expectedPaths: [PersonaFixture.metaPath("other_name")],
        },
        {
            name: "emote meta file named after piece_name matches",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "emote meta file other_name.meta.json differs from piece_name em_spright_wave",
            files: PersonaFixture.emoteFiles({ metaName: "other_name" }),
            expectedIds: ["PERSONA/203"],
            expectedPaths: [PersonaFixture.metaPath("other_name")],
        },
    ];

    static run(entry: PieceNameMismatchReportsNameDifferenceCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new PieceNameMismatch(), entry.files, entry.contentType ?? "persona");
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultipleMetaFilesReportsSecondMetaCase } from "../Types/MultipleMetaFilesReportsSecondMetaTypes.js";
import MultipleMetaFiles from "../../src/Checks/Persona/MultipleMetaFiles.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class MultipleMetaFilesReportsSecondMeta {
    static readonly ID = "PERSONA/601";
    static readonly CASES: readonly MultipleMetaFilesReportsSecondMetaCase[] = [
        { name: "pack with one .meta.json has the allowed single meta file", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "pack with a zz_extra .meta.json has more than one meta file",
            files: PersonaFixture.pieceFiles({
                extra: { [PersonaFixture.metaPath("zz_extra")]: PersonaFixture.pieceMeta({ piece_name: "zz_extra" }) },
            }),
            expectedIds: ["PERSONA/601"],
            expectedPaths: [PersonaFixture.metaPath("zz_extra")],
        },
    ];

    static run(entry: MultipleMetaFilesReportsSecondMetaCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new MultipleMetaFiles(), entry.files, entry.contentType ?? "persona");
    }
}

import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MetaFileMissingReportsPackWithoutMetaCase } from "../Types/MetaFileMissingReportsPackWithoutMetaTypes.js";
import MetaFileMissing from "../../src/Checks/Persona/MetaFileMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class MetaFileMissingReportsPackWithoutMeta {
    static readonly ID = "PERSONA/101";
    static readonly CASES: readonly MetaFileMissingReportsPackWithoutMetaCase[] = [
        { name: "piece pack with a .meta.json has the required meta file", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "piece pack without a .meta.json lacks the required meta file",
            files: PersonaFixture.without(PersonaFixture.pieceFiles({}), PersonaFixture.metaPath()),
            expectedIds: ["PERSONA/101"],
            expectedPaths: [PersonaFixture.MANIFEST_PATH],
        },
        {
            name: "emote pack without a .meta.json lacks the required meta file",
            files: PersonaFixture.without(PersonaFixture.emoteFiles({}), PersonaFixture.metaPath(PersonaFixture.EMOTE_ID)),
            expectedIds: ["PERSONA/101"],
            contentType: "persona",
        },
    ];

    static run(entry: MetaFileMissingReportsPackWithoutMetaCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new MetaFileMissing(), entry.files, entry.contentType ?? "persona");
    }
}

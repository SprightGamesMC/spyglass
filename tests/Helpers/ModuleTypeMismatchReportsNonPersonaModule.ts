import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ModuleTypeMismatchReportsNonPersonaModuleCase } from "../Types/ModuleTypeMismatchReportsNonPersonaModuleTypes.js";
import ModuleTypeMismatch from "../../src/Checks/Persona/ModuleTypeMismatch.js";
import ModelFixture from "./Core/ModelFixture.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ModuleTypeMismatchReportsNonPersonaModule {
    static readonly ID = "PERSONA/215";
    static readonly CASES: readonly ModuleTypeMismatchReportsNonPersonaModuleCase[] = [
        {
            name: "persona_piece module is the required module type for a persona pack",
            files: PersonaFixture.pieceFiles({}),
            expectedIds: [],
        },
        {
            name: "skin_pack module is not the persona_piece type a persona pack requires",
            files: PersonaFixture.pieceFiles({ manifest: ModelFixture.skinManifest() }),
            expectedIds: ["PERSONA/215"],
            expectedPaths: [PersonaFixture.MANIFEST_PATH],
        },
    ];

    static run(entry: ModuleTypeMismatchReportsNonPersonaModuleCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new ModuleTypeMismatch(), entry.files, entry.contentType ?? "persona");
    }
}

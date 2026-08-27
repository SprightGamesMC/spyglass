import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { HeadTextureSizeInvalidReportsWidthNot32Case } from "../Types/HeadTextureSizeInvalidReportsWidthNot32Types.js";
import HeadTextureSizeInvalid from "../../src/Checks/Persona/HeadTextureSizeInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class HeadTextureSizeInvalidReportsWidthNot32 {
    static readonly ID = "PERSONA/209";
    static readonly CASES: readonly HeadTextureSizeInvalidReportsWidthNot32Case[] = [
        { name: "32 pixel head texture width is the required width", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "64 pixel head texture width is not 32",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), [PersonaFixture.HEAD_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }) },
            }),
            expectedIds: ["PERSONA/209"],
            expectedPaths: [PersonaFixture.path(PersonaFixture.HEAD_TEXTURE)],
        },
    ];

    static run(entry: HeadTextureSizeInvalidReportsWidthNot32Case): Promise<FindingSummary> {
        return PersonaFixture.summary(new HeadTextureSizeInvalid(), entry.files, entry.contentType ?? "persona");
    }
}

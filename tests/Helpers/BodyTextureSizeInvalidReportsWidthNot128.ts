import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BodyTextureSizeInvalidReportsWidthNot128Case } from "../Types/BodyTextureSizeInvalidReportsWidthNot128Types.js";
import BodyTextureSizeInvalid from "../../src/Checks/Persona/BodyTextureSizeInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class BodyTextureSizeInvalidReportsWidthNot128 {
    static readonly ID = "PERSONA/208";
    static readonly CASES: readonly BodyTextureSizeInvalidReportsWidthNot128Case[] = [
        { name: "128 pixel body texture width is the required width", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "64 pixel body texture width is not 128",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), [PersonaFixture.BODY_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }) },
            }),
            expectedIds: ["PERSONA/208"],
            expectedPaths: [PersonaFixture.path(PersonaFixture.BODY_TEXTURE)],
        },
    ];

    static run(entry: BodyTextureSizeInvalidReportsWidthNot128Case): Promise<FindingSummary> {
        return PersonaFixture.summary(new BodyTextureSizeInvalid(), entry.files, entry.contentType ?? "persona");
    }
}

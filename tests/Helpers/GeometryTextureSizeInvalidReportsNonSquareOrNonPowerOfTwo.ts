import type { Finding } from "../../src/Types/CheckTypes.js";
import type { GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwoCase } from "../Types/GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwoTypes.js";
import GeometryTextureSizeInvalid from "../../src/Checks/Persona/GeometryTextureSizeInvalid.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwo {
    static readonly ID = "PERSONA/210";
    static readonly CASES: readonly GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwoCase[] = [
        { name: "64 by 64 texture is square and a power of two", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "64 by 32 texture is not square",
            files: PersonaFixture.pieceFiles({
                textures: {
                    ...PersonaFixture.defaultTextures(),
                    [PersonaFixture.GEOMETRY_TEXTURE]: ImageBytes.png({ width: 64, height: 32 }),
                },
            }),
            expectedIds: ["PERSONA/210"],
        },
        {
            name: "48 by 48 texture is square but not a power of two",
            files: PersonaFixture.pieceFiles({
                textures: {
                    ...PersonaFixture.defaultTextures(),
                    [PersonaFixture.GEOMETRY_TEXTURE]: ImageBytes.png({ width: 48, height: 48 }),
                },
            }),
            expectedIds: ["PERSONA/210"],
        },
    ];

    static run(entry: GeometryTextureSizeInvalidReportsNonSquareOrNonPowerOfTwoCase): Promise<Finding[]> {
        return PersonaFixture.run(new GeometryTextureSizeInvalid(), entry.files, entry.contentType ?? "persona");
    }
}

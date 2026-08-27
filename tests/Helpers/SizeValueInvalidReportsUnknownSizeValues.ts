import type { Finding } from "../../src/Types/CheckTypes.js";
import type { SizeValueInvalidReportsUnknownSizeValuesCase } from "../Types/SizeValueInvalidReportsUnknownSizeValuesTypes.js";
import SizeValueInvalid from "../../src/Checks/Persona/SizeValueInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class SizeValueInvalidReportsUnknownSizeValues {
    static readonly ID = "PERSONA/213";
    static readonly CASES: readonly SizeValueInvalidReportsUnknownSizeValuesCase[] = [
        {
            name: "body_size tall, arm_size slim and side left are known values",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    geometry_sources: [{ geometry: "geometry.spright_hat.tall", body_size: "tall", arm_size: "slim", side: "left" }],
                },
            }),
            expectedIds: [],
        },
        {
            name: "body_size huge, arm_size thin and side middle are three unknown values",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    geometry_sources: [{ geometry: "geometry.spright_hat.tall", body_size: "huge", arm_size: "thin", side: "middle" }],
                },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/213", 3),
        },
    ];

    static run(entry: SizeValueInvalidReportsUnknownSizeValuesCase): Promise<Finding[]> {
        return PersonaFixture.run(new SizeValueInvalid(), entry.files, entry.contentType ?? "persona");
    }
}

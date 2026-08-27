import type { Finding } from "../../src/Types/CheckTypes.js";
import type { TintColorInvalidReportsNonHexValueCase } from "../Types/TintColorInvalidReportsNonHexValueTypes.js";
import TintColorInvalid from "../../src/Checks/Persona/TintColorInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TintColorInvalidReportsNonHexValue {
    static readonly ID = "PERSONA/216";
    static readonly CASES: readonly TintColorInvalidReportsNonHexValueCase[] = [
        {
            name: "#FFFFFF #00ff00 #0000FF and #000000 tint values are hex colors",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { tint_base_color: { r_color: "#FFFFFF", g_color: "#00ff00", b_color: "#0000FF", a_color: "#000000" } },
            }),
            expectedIds: [],
        },
        {
            name: "red and 255 tint values are not hex colors",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { tint_color: { r_color: "#FFFFFF", g_color: "red", b_color: "#00ff00", a_color: 255 } },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/216", 2),
        },
    ];

    static run(entry: TintColorInvalidReportsNonHexValueCase): Promise<Finding[]> {
        return PersonaFixture.run(new TintColorInvalid(), entry.files, entry.contentType ?? "persona");
    }
}

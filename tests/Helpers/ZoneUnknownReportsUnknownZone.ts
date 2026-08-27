import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ZoneUnknownReportsUnknownZoneCase } from "../Types/ZoneUnknownReportsUnknownZoneTypes.js";
import ZoneUnknown from "../../src/Checks/Persona/ZoneUnknown.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ZoneUnknownReportsUnknownZone {
    static readonly ID = "PERSONA/214";
    static readonly CASES: readonly ZoneUnknownReportsUnknownZoneCase[] = [
        {
            name: "head_top and head_front are known zones",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { zone: ["head_top"], geometry_sources: [{ geometry: "geometry.spright_hat.tall", zone: ["head_front"] }] },
            }),
            expectedIds: [],
        },
        {
            name: "piece zone hat_brim is not a known zone",
            files: PersonaFixture.pieceFiles({ metaOverrides: { zone: ["head_top", "hat_brim"] } }),
            expectedIds: ["PERSONA/214"],
        },
        {
            name: "geometry zone nowhere is not a known zone",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { geometry_sources: [{ geometry: "geometry.spright_hat.tall", zone: "nowhere" }] },
            }),
            expectedIds: ["PERSONA/214"],
        },
    ];

    static run(entry: ZoneUnknownReportsUnknownZoneCase): Promise<Finding[]> {
        return PersonaFixture.run(new ZoneUnknown(), entry.files, entry.contentType ?? "persona");
    }
}

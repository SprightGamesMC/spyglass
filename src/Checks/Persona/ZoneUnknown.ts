import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { PersonaPackData, PersonaZoneField } from "../../Types/PersonaTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class ZoneUnknown extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.ZONE_UNKNOWN,
        slug: "zone-unknown",
        severity: "error",
        description: "Zone name is not a known zone",
    };

    private static zoneFields(data: PersonaPackData): PersonaZoneField[] {
        const fields = [{ zones: PersonaLoader.zoneList(data.meta?.zone), field: "zone" }];

        for (const source of PersonaLoader.geometrySources(data.meta)) {
            fields.push({ zones: PersonaLoader.zoneList(source.entry.zone), field: source.field + ".zone" });
        }

        return fields;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const { zones, field } of ZoneUnknown.zoneFields(data)) {
                for (const zone of zones) {
                    if (PersonaLimits.ZONES.includes(zone)) {
                        continue;
                    }

                    findings.push(this.finding("Zone " + zone + " is not a known zone", data.metaPath, data.pack.root, { field }));
                }
            }
        }

        return findings;
    }
}

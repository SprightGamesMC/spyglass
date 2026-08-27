import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class ZoneOverlap extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.ZONE_OVERLAP,
        slug: "zone-overlap",
        severity: "error",
        description: "Piece level zones overlap cube or geometry level zones",
    };

    private static geometryLevelZones(data: PersonaPackData): Set<string> {
        const zones = new Set<string>();

        for (const source of PersonaLoader.geometrySources(data.meta)) {
            for (const zone of PersonaLoader.zoneList(source.entry.zone)) {
                zones.add(zone);
            }

            const identifier = PersonaLoader.string(source.entry, "geometry");
            const parsed = identifier === undefined ? undefined : PersonaLoader.parseGeometryIdentifier(identifier);

            if (parsed?.zone !== undefined) {
                zones.add(parsed.zone);
            }
        }

        return zones;
    }

    private static async cubeLevelZones(context: CheckContext, data: PersonaPackData): Promise<Set<string>> {
        const zones = new Set<string>();

        for (const path of data.geometryPaths) {
            const root = await context.loaders.json.readObject(path);

            for (const zone of PersonaLoader.zonesInValue(root)) {
                zones.add(zone);
            }
        }

        return zones;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const pieceZones = PersonaLoader.zoneList(data.meta?.zone);

            if (pieceZones.length === 0 || data.metaPath === undefined) {
                continue;
            }

            const geometryZones = ZoneOverlap.geometryLevelZones(data);
            const cubeZones = await ZoneOverlap.cubeLevelZones(context, data);

            for (const zone of pieceZones) {
                const level = geometryZones.has(zone) ? "geometry" : cubeZones.has(zone) ? "cube" : undefined;

                if (level === undefined) {
                    continue;
                }

                findings.push(
                    this.finding("Piece level zone " + zone + " is also a " + level + " level zone", data.metaPath, data.pack.root, {
                        field: "zone",
                    })
                );
            }
        }

        return findings;
    }
}

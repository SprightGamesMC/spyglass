import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import PersonaFormatVersionCheck from "../Common/PersonaFormatVersionCheck.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class GeometryFormatVersionInvalid extends PersonaFormatVersionCheck {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_FORMAT_VERSION_INVALID,
        slug: "geometry-format-version-invalid",
        severity: "error",
        description: "Geometry file format_version is not 1.8.0",
    };
    protected readonly label = "Geometry";
    protected readonly expectedVersion = PersonaLimits.GEOMETRY_FORMAT_VERSION;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            for (const path of data.geometryPaths) {
                const root = await context.loaders.json.readObject(path);

                if (root === undefined) {
                    continue;
                }

                const finding = this.formatVersionFinding(root, path, data.pack.root);

                if (finding !== undefined) {
                    findings.push(finding);
                }
            }
        }

        return findings;
    }
}

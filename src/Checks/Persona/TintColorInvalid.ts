import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class TintColorInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TINT_COLOR_INVALID,
        slug: "tint-color-invalid",
        severity: "error",
        description: "Tint color value is not a hex color",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const tintField of PersonaLimits.TINT_FIELDS) {
                const tint = JsonLoader.get(data.meta, tintField);

                if (!JsonLoader.isObject(tint)) {
                    continue;
                }

                for (const channel of PersonaLimits.TINT_CHANNELS) {
                    const value = tint[channel];

                    if (value === undefined || (typeof value === "string" && PersonaLimits.HEX_COLOR_PATTERN.test(value))) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            tintField + " " + channel + " " + String(value) + " is not a #RRGGBB color",
                            data.metaPath,
                            data.pack.root,
                            {
                                field: tintField + "." + channel,
                            }
                        )
                    );
                }
            }
        }

        return findings;
    }
}

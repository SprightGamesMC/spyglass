import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaLimits from "../Persona/PersonaLimits.js";

export default abstract class PersonaLangKeyCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const key = this.key(data);

            if (key === undefined) {
                continue;
            }

            const lang = await PersonaLoader.lang(context, data.pack);

            if (lang === undefined) {
                findings.push(this.finding("No " + PersonaLimits.LANG_PATH + " file for " + key, data.pack.manifestPath, data.pack.root));
                continue;
            }

            if (lang.entries.has(key)) {
                continue;
            }

            findings.push(this.finding("Lang file has no " + key + " key", lang.path, data.pack.root));
        }

        return findings;
    }

    protected abstract key(data: PersonaPackData): string | undefined;
}

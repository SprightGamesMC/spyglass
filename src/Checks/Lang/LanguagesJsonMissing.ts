import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class LanguagesJsonMissing extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANGUAGES_JSON_MISSING,
        slug: "languages-json-missing",
        severity: "error",
        description: "Pack has no texts/languages.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            if (catalog.status !== "missing") {
                continue;
            }

            findings.push(this.finding("Pack has no " + LangLimits.CATALOG_PATH, undefined, pack.root));
        }

        return findings;
    }
}

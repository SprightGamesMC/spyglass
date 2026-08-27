import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";

export default class LanguagesJsonInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANGUAGES_JSON_INVALID,
        slug: "languages-json-invalid",
        severity: "error",
        description: "languages.json is not a list of language codes",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            if (catalog.status !== "invalid" || catalog.item === undefined) {
                continue;
            }

            findings.push(this.finding("languages.json must be a JSON array of language code strings", catalog.item.path, pack.root));
        }

        return findings;
    }
}

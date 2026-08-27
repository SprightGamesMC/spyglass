import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";

export default class LangFileNotInCatalog extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANG_FILE_NOT_IN_CATALOG,
        slug: "lang-file-not-in-catalog",
        severity: "error",
        description: ".lang file code is not in languages.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            if (catalog.status !== "ok") {
                continue;
            }

            for (const item of catalog.langFiles) {
                const code = PathUtilities.nameWithoutExtension(item.path);

                if (catalog.codes.includes(code)) {
                    continue;
                }

                findings.push(this.finding("Lang file " + code + " is not listed in languages.json", item.path, pack.root));
            }
        }

        return findings;
    }
}

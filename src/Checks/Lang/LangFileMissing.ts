import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";

export default class LangFileMissing extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANG_FILE_MISSING,
        slug: "lang-file-missing",
        severity: "error",
        description: "languages.json entry has no matching .lang file",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            if (catalog.status !== "ok" || catalog.item === undefined) {
                continue;
            }

            const namesWithoutExtension = new Set(catalog.langFiles.map((item) => PathUtilities.nameWithoutExtension(item.path)));

            for (const code of catalog.codes) {
                if (namesWithoutExtension.has(code)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "languages.json lists " +
                            code +
                            " but " +
                            LanguageCatalogReader.TEXTS_FOLDER +
                            "/" +
                            code +
                            LanguageCatalogReader.LANG_EXTENSION +
                            " does not exist",
                        catalog.item.path,
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}

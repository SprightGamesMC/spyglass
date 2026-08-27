import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class LangKeyDuplicate extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANG_KEY_DUPLICATE,
        slug: "lang-key-duplicate",
        severity: "error",
        description: ".lang file has the same key more than once",
    };

    private static repeatedKeys(lines: readonly string[]): string[] {
        const seen = new Set<string>();
        const repeated = new Set<string>();

        for (const line of lines) {
            const trimmed = line.trim();
            const separator = trimmed.indexOf(LangLimits.KEY_VALUE_SEPARATOR);

            if (trimmed.startsWith(LangLimits.COMMENT_CHARACTER) || separator <= 0) {
                continue;
            }

            const key = trimmed.slice(0, separator).trim();

            if (seen.has(key)) {
                repeated.add(key);
                continue;
            }

            seen.add(key);
        }

        return [...repeated].sort();
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            for (const item of catalog.langFiles) {
                const lines = await context.loaders.text.readLines(item.path);

                if (lines === undefined) {
                    continue;
                }

                for (const key of LangKeyDuplicate.repeatedKeys(lines)) {
                    findings.push(this.finding("Key " + key + " appears more than once", item.path, pack.root, { field: key }));
                }
            }
        }

        return findings;
    }
}

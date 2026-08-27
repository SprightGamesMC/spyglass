import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ProfanityWords from "../../Data/ProfanityWords.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class ProfanityInText extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.PROFANITY_IN_TEXT,
        slug: "profanity-in-text",
        severity: "error",
        description: ".lang value contains a word from the profanity list",
    };

    private static match(value: string, tokens: ReadonlySet<string>, phrases: readonly string[]): string | undefined {
        const lower = value.toLowerCase();

        for (const token of lower.split(LangLimits.TOKEN_SEPARATOR)) {
            if (tokens.has(token)) {
                return token;
            }
        }

        return phrases.find((phrase) => lower.includes(phrase));
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const tokens = ProfanityWords.tokens();
        const phrases = ProfanityWords.phrases();

        for (const pack of context.model.packs) {
            const catalog = await LanguageCatalogReader.read(context, pack);

            for (const item of catalog.langFiles) {
                const entries = await context.loaders.text.readLangEntries(item.path);

                for (const [key, value] of entries ?? []) {
                    const word = ProfanityInText.match(value, tokens, phrases);

                    if (word === undefined) {
                        continue;
                    }

                    findings.push(this.finding("Value of " + key + " contains " + word, item.path, pack.root, { field: key }));
                }
            }
        }

        return findings;
    }
}

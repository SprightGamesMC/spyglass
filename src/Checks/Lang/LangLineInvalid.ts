import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentItem, Pack } from "../../Types/ModelTypes.js";
import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";
import Check from "../Check.js";
import LangChecks from "./LangChecks.js";
import LangLimits from "./LangLimits.js";

export default class LangLineInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: LangChecks.GROUP,
        number: LangChecks.LANG_LINE_INVALID,
        slug: "lang-line-invalid",
        severity: "error",
        description: ".lang line is not a key and value separated by =",
    };

    private static problem(line: string): string | undefined {
        const trimmed = line.trim();

        if (trimmed === "" || trimmed.startsWith(LangLimits.COMMENT_MARKER)) {
            return undefined;
        }

        if (trimmed.startsWith(LangLimits.COMMENT_CHARACTER)) {
            return "comment does not start with " + LangLimits.COMMENT_MARKER;
        }

        const separator = trimmed.indexOf(LangLimits.KEY_VALUE_SEPARATOR);

        if (separator < 0) {
            return "no " + LangLimits.KEY_VALUE_SEPARATOR + " between key and value";
        }

        if (separator === 0) {
            return "key is empty";
        }

        const key = trimmed.slice(0, separator);

        if (!LangLimits.KEY_PATTERN.test(key)) {
            return "key " + key + " contains " + LangLineInvalid.describeCharacter(key) + ", expected " + LangLimits.KEY_ALLOWED_CHARACTERS;
        }

        const rest = trimmed.slice(separator + 1);
        const commentProblem = LangLineInvalid.commentProblem(rest);

        if (commentProblem !== undefined) {
            return commentProblem;
        }

        return rest.split(LangLimits.VALUE_COMMENT_SEPARATOR)[0].trim() === "" ? "value is empty" : undefined;
    }

    private static commentProblem(rest: string): string | undefined {
        const hash = rest.indexOf(LangLimits.COMMENT_CHARACTER);

        if (hash < 0) {
            return undefined;
        }

        if (rest[hash - 1] !== LangLimits.VALUE_COMMENT_SEPARATOR) {
            return "comment does not follow a tab";
        }

        if (!rest.startsWith(LangLimits.COMMENT_MARKER, hash)) {
            return "comment does not start with " + LangLimits.COMMENT_MARKER;
        }

        return undefined;
    }

    private static describeCharacter(key: string): string {
        const character = LangLimits.KEY_DISALLOWED_CHARACTER.exec(key)?.[0] ?? "";

        if (character === " ") {
            return "a space";
        }

        if (character === "\t") {
            return "a tab";
        }

        return character;
    }

    private lines(pack: Pack, item: ContentItem, lines: readonly string[]): Finding[] {
        const findings: Finding[] = [];

        lines.forEach((line, index) => {
            const problem = LangLineInvalid.problem(line);

            if (problem === undefined) {
                return;
            }

            findings.push(this.finding("Line " + (index + 1) + " is invalid, " + problem, item.path, pack.root, { line: index + 1 }));
        });

        return findings;
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

                findings.push(...this.lines(pack, item, lines));
            }
        }

        return findings;
    }
}

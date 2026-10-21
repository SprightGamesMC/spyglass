export default abstract class PathPattern {
    private static readonly WILDCARDS = /(\*\*\/|\*\*|\*|\?)/;
    private static readonly REGULAR_EXPRESSION_CHARACTERS = /[.*+?^${}()|[\]\\]/g;
    private static readonly WILDCARD_EXPRESSIONS: Readonly<Record<string, string>> = {
        "**/": "(?:.*/)?",
        "**": ".*",
        "*": "[^/]*",
        "?": "[^/]",
    };

    static matches(pattern: string, value: string): boolean {
        return PathPattern.expression(pattern).test(PathPattern.forwardSlashes(value));
    }

    private static expression(pattern: string): RegExp {
        const parts = PathPattern.forwardSlashes(pattern).split(PathPattern.WILDCARDS);
        const source = parts.map((part) => PathPattern.WILDCARD_EXPRESSIONS[part] ?? PathPattern.escape(part)).join("");

        return new RegExp("^" + source + "$");
    }

    private static forwardSlashes(text: string): string {
        return text.replaceAll("\\", "/");
    }

    private static escape(text: string): string {
        return text.replace(PathPattern.REGULAR_EXPRESSION_CHARACTERS, "\\$&");
    }
}

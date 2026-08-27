import type { JsonValue } from "../Types/LoaderTypes.js";

export default abstract class JsoncParser {
    static parse(text: string): JsonValue {
        return JSON.parse(JsoncParser.stripComments(text)) as JsonValue;
    }

    private static stripComments(text: string): string {
        let output = "";
        let index = 0;
        let inString = false;

        while (index < text.length) {
            const character = text[index];
            const next = text[index + 1];

            if (inString) {
                output += character;

                if (character === "\\" && index + 1 < text.length) {
                    output += next;
                    index += 2;
                    continue;
                }

                if (character === '"') {
                    inString = false;
                }

                index += 1;
                continue;
            }

            if (character === '"') {
                inString = true;
                output += character;
                index += 1;
                continue;
            }

            if (character === "/" && next === "/") {
                index = JsoncParser.skipLineComment(text, index);
                continue;
            }

            if (character === "/" && next === "*") {
                const end = text.indexOf("*/", index + 2);
                const blockEnd = end < 0 ? text.length : end + 2;

                output += JsoncParser.preserveLineBreaks(text.slice(index, blockEnd));
                index = blockEnd;
                continue;
            }

            output += character;
            index += 1;
        }

        return output;
    }

    private static skipLineComment(text: string, start: number): number {
        const end = text.indexOf("\n", start);

        return end < 0 ? text.length : end;
    }

    private static preserveLineBreaks(comment: string): string {
        return comment.replace(/[^\n]/g, "");
    }
}

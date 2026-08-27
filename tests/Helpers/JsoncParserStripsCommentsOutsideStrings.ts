import type { JsoncCase } from "../Types/JsoncParserStripsCommentsOutsideStringsTypes.js";
import JsoncParser from "../../src/Loaders/JsoncParser.js";

export default abstract class JsoncParserStripsCommentsOutsideStrings {
    static readonly CASES: readonly JsoncCase[] = [
        { name: "line comment outside a string is stripped", text: '{\n// hi\n"a": 1\n}', expected: { a: 1 } },
        { name: "block comment outside a string is stripped", text: '{"a": /* x */ 1}', expected: { a: 1 } },
        { name: "double slash in a url inside a string is kept", text: '{"a": "http://x.y/z"}', expected: { a: "http://x.y/z" } },
        {
            name: "comment markers inside a string are kept as text",
            text: '{"a": "/* not a comment */ // still text"}',
            expected: { a: "/* not a comment */ // still text" },
        },
        {
            name: "escaped quote does not end the string so the double slash after it is kept",
            text: '{"a": "say \\"hi\\" // ok"}',
            expected: { a: 'say "hi" // ok' },
        },
        { name: "unterminated block comment after the value is stripped to the end", text: '{"a": 1} /* open', expected: { a: 1 } },
    ];

    static parse(text: string): unknown {
        return JsoncParser.parse(text);
    }

    static parseFails(text: string): boolean {
        try {
            JsoncParser.parse(text);

            return false;
        } catch {
            return true;
        }
    }
}

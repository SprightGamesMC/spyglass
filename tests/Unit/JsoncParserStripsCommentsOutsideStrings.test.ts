import assert from "node:assert/strict";
import { test } from "node:test";
import JsoncParserStripsCommentsOutsideStrings from "../Helpers/JsoncParserStripsCommentsOutsideStrings.js";

for (const entry of JsoncParserStripsCommentsOutsideStrings.CASES) {
    test(entry.name, () => {
        assert.deepEqual(JsoncParserStripsCommentsOutsideStrings.parse(entry.text), entry.expected);
    });
}

test("trailing comma is not a comment so parsing still throws", () => {
    assert.equal(JsoncParserStripsCommentsOutsideStrings.parseFails('{"a": 1,}'), true);
});

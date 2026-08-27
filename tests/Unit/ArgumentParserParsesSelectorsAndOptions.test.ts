import assert from "node:assert/strict";
import { test } from "node:test";
import ArgumentParserParsesSelectorsAndOptions from "../Helpers/ArgumentParserParsesSelectorsAndOptions.js";

for (const entry of ArgumentParserParsesSelectorsAndOptions.SKIP_CASES) {
    test(
        "skip selector " +
            entry.text +
            (entry.expected === undefined
                ? " is rejected because it is not GROUP, GROUP/number, GROUP/list, or GROUP/range"
                : " parses into its group and numbers"),
        () => {
            assert.deepEqual(ArgumentParserParsesSelectorsAndOptions.parseSkipOrUndefined(entry.text), entry.expected);
        }
    );
}

test("world with every option set parses each option into its field", () => {
    const options = ArgumentParserParsesSelectorsAndOptions.parse([
        "world",
        "--input",
        "./w",
        "--layout=marketplace",
        "--skip",
        "CHUNK",
        "--fail-on",
        "warning",
        "--severity",
        "DEFINITION/601=error",
        "--format",
        "json",
        "--no-color",
    ]);

    assert.equal(options.contentType, "world");
    assert.equal(options.input, "./w");
    assert.equal(options.layout, "marketplace");
    assert.deepEqual(options.skips, [{ group: "CHUNK" }]);
    assert.equal(options.failOn, "warning");
    assert.deepEqual(options.severityOverrides, [{ target: "DEFINITION/601", severity: "error" }]);
    assert.equal(options.format, "json");
    assert.equal(options.noColor, true);
});

test("addon with no options gets input ., layout standard, format text, and verbosity normal", () => {
    const options = ArgumentParserParsesSelectorsAndOptions.parse(["addon"]);

    assert.equal(options.input, ".");
    assert.equal(options.layout, "standard");
    assert.equal(options.format, "text");
    assert.equal(options.verbosity, "normal");
    assert.equal(options.failOn, undefined);
});

test("content type mod, option --unknown, --input without a value, and --severity without =level are usage errors", () => {
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["mod"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["addon", "--unknown"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["addon", "--input"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["addon", "--severity", "DEFINITION/601"]), true);
});

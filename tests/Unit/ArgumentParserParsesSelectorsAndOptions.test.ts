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
        "check",
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

    assert.equal(options.command, "check");
    assert.equal(options.contentType, "world");
    assert.equal(options.input, "./w");
    assert.equal(options.layout, "marketplace");
    assert.deepEqual(options.skips, [{ group: "CHUNK" }]);
    assert.equal(options.failOn, "warning");
    assert.deepEqual(options.severityOverrides, [{ target: "DEFINITION/601", severity: "error" }]);
    assert.equal(options.format, "json");
    assert.equal(options.noColor, true);
});

test("check addon with no options leaves every setting undefined so the config or the default can give it", () => {
    const options = ArgumentParserParsesSelectorsAndOptions.parse(["check", "addon"]);

    assert.equal(options.input, undefined);
    assert.equal(options.layout, undefined);
    assert.equal(options.format, undefined);
    assert.equal(options.verbosity, undefined);
    assert.equal(options.noColor, undefined);
    assert.equal(options.failOn, undefined);
});

test("check alone has no content type and no arguments at all has no command", () => {
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parse(["check"]).contentType, undefined);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parse([]).command, undefined);
});

test("content type mod, option --unknown, --input without a value, and --severity without =level are usage errors", () => {
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["check", "mod"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["check", "addon", "--unknown"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["check", "addon", "--input"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["check", "addon", "--severity", "DEFINITION/601"]), true);
});

test("command run, content type addon without check, and a third argument after check addon are usage errors", () => {
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["run"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["addon"]), true);
    assert.equal(ArgumentParserParsesSelectorsAndOptions.parseThrows(["check", "addon", "world"]), true);
});

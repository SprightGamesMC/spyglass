import assert from "node:assert/strict";
import { test } from "node:test";
import LoggerFiltersByVerbosity from "../Helpers/LoggerFiltersByVerbosity.js";

for (const entry of LoggerFiltersByVerbosity.CASES) {
    test(LoggerFiltersByVerbosity.caseName(entry), () => {
        assert.deepEqual(LoggerFiltersByVerbosity.emittedLevels(entry.verbosity), entry.enabled);
    });
}

test("sinks receive level and message for each entry and the silent threshold discards even an error", () => {
    const { logger, entries } = LoggerFiltersByVerbosity.captured();

    logger.summary("hello");
    logger.debug("detail");

    assert.deepEqual(
        entries.map((item) => item.level + ":" + item.message),
        ["summary:hello", "debug:detail"]
    );
    assert.equal(LoggerFiltersByVerbosity.silentLoggerEmits("error"), false);
});

test("format prefixes verbose and debug with their level and leaves error and summary without a prefix", () => {
    assert.equal(LoggerFiltersByVerbosity.format("summary", "b"), "b\n");
    assert.equal(LoggerFiltersByVerbosity.format("error", "c"), "c\n");
    assert.equal(LoggerFiltersByVerbosity.format("verbose", "d"), "verbose: d\n");
    assert.equal(LoggerFiltersByVerbosity.format("debug", "e"), "debug: e\n");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import CliExitCodesMatchDocumentation from "../Helpers/CliExitCodesMatchDocumentation.js";

for (const entry of CliExitCodesMatchDocumentation.CASES) {
    test(entry.name, () => {
        const result = CliExitCodesMatchDocumentation.run(entry);

        assert.equal(result.exitCode, entry.exitCode, result.stderr);

        if (entry.stdoutIncludes !== undefined) {
            assert.match(result.stdout, new RegExp(entry.stdoutIncludes.replaceAll("/", "\\/")));
        }

        if (entry.stderrIncludes !== undefined) {
            assert.match(result.stderr, new RegExp(entry.stderrIncludes));
        }
    });
}

test("manifest that does not parse is a FILE/201 finding with exit 1 and fail on none keeps exit 0", () => {
    const failed = CliExitCodesMatchDocumentation.runOnBrokenJsonFolder(["addon"]);
    const passed = CliExitCodesMatchDocumentation.runOnBrokenJsonFolder(["addon", "--fail-on", "none"]);

    assert.equal(failed.exitCode, 1, failed.stderr);
    assert.match(failed.stdout, /FILE\/201/);
    assert.equal(passed.exitCode, 0, passed.stderr);
});

test("mcaddon that is not a zip is a tool error with exit 3", () => {
    const result = CliExitCodesMatchDocumentation.runOnBrokenArchive();

    assert.equal(result.exitCode, 3, result.stderr);
    assert.match(result.stderr, /Tool error/);
});

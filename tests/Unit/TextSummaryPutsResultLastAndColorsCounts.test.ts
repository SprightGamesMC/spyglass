import assert from "node:assert/strict";
import { test } from "node:test";
import TextSummaryPutsResultLastAndColorsCounts from "../Helpers/TextSummaryPutsResultLastAndColorsCounts.js";

for (const entry of TextSummaryPutsResultLastAndColorsCounts.CASES) {
    test("one " + entry.severity + " finding colors the " + entry.severity + " count because the count is above zero", () => {
        const summary = TextSummaryPutsResultLastAndColorsCounts.render([entry.severity], true, 0);

        assert.ok(summary.includes(TextSummaryPutsResultLastAndColorsCounts.colored(entry.severity, entry.label)));
    });
}

test("a run with no findings writes every count in gray and never prints a red zero", () => {
    const summary = TextSummaryPutsResultLastAndColorsCounts.render([], true, 0);
    const gray = TextSummaryPutsResultLastAndColorsCounts.GRAY;
    const reset = TextSummaryPutsResultLastAndColorsCounts.RESET;

    assert.ok(summary.includes("Summary: " + gray + "0 errors" + reset + ", " + gray + "0 warnings" + reset));
});

test("a warning finding leaves the error count gray because only a count above zero takes its severity color", () => {
    const summary = TextSummaryPutsResultLastAndColorsCounts.render(["warning"], true, 0);
    const gray = TextSummaryPutsResultLastAndColorsCounts.GRAY;

    assert.ok(summary.includes(gray + "0 errors"));
    assert.ok(summary.includes(TextSummaryPutsResultLastAndColorsCounts.colored("warning", "1 warnings")));
});

test("an error finding puts the fail verdict on the last line so the verdict is never buried above other text", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], false, 0);

    assert.equal(lines[lines.length - 1], "Result: fail");
});

test("a run with no findings puts the pass verdict on the last line colored green", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines([], true, 0);
    const expected = TextSummaryPutsResultLastAndColorsCounts.GREEN + "pass" + TextSummaryPutsResultLastAndColorsCounts.RESET;

    assert.equal(lines[lines.length - 1], "Result: " + expected);
});

test("the run start time is the first line so it is on screen before the run can crash", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], false, 0);

    assert.equal(lines[0], "Run at " + TextSummaryPutsResultLastAndColorsCounts.STARTED_AT);
});

test("the elapsed line is above the verdict and below the counts", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], false, 412);

    assert.equal(lines[lines.length - 2], "Elapsed: 412 ms");
});

test("an elapsed time of one second or more is written in seconds instead of milliseconds", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], false, 1500);

    assert.equal(lines[lines.length - 2], "Elapsed: 1.5 s");
});

test("color turned off leaves no escape characters anywhere in the summary", () => {
    const summary = TextSummaryPutsResultLastAndColorsCounts.render(["error", "warning", "recommendation"], false, 412);

    assert.ok(!summary.includes(TextSummaryPutsResultLastAndColorsCounts.ESCAPE));
});

test("the run start line is gray so the counts and the verdict stand out", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], true, 412);

    assert.ok(lines[0].startsWith(TextSummaryPutsResultLastAndColorsCounts.GRAY));
});

test("the elapsed line keeps the default color so the run time reads as plainly as the counts", () => {
    const lines = TextSummaryPutsResultLastAndColorsCounts.lines(["error"], true, 412);

    assert.equal(lines[lines.length - 2], "Elapsed: 412 ms");
});

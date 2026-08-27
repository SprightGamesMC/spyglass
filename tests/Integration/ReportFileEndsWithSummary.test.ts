import assert from "node:assert/strict";
import { test } from "node:test";
import ReportFileEndsWithSummary from "../Helpers/ReportFileEndsWithSummary.js";

for (const entry of ReportFileEndsWithSummary.CASES) {
    test(entry.name, () => {
        const text = ReportFileEndsWithSummary.write(entry);
        const summaryPresent = text.includes("Summary: ") && text.includes("Result: ");

        assert.equal(summaryPresent, entry.endsWithSummary, text.slice(-200));
    });
}

test("the verdict is the last line of a text report file so it is never buried above the findings", () => {
    const text = ReportFileEndsWithSummary.write(ReportFileEndsWithSummary.CASES[0]);

    assert.equal(ReportFileEndsWithSummary.lastLine(text), "Result: fail");
});

test("a text report file has no escape characters because a file is never colored", () => {
    const text = ReportFileEndsWithSummary.write(ReportFileEndsWithSummary.CASES[0]);

    assert.ok(!text.includes("\u001b"));
});

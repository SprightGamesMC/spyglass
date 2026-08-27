import assert from "node:assert/strict";
import { test } from "node:test";
import ReportBuilderDecidesPassByFailLevel from "../Helpers/ReportBuilderDecidesPassByFailLevel.js";

for (const entry of ReportBuilderDecidesPassByFailLevel.CASES) {
    test(ReportBuilderDecidesPassByFailLevel.describe(entry), () => {
        const report = ReportBuilderDecidesPassByFailLevel.build(entry.severities, entry.failOn);

        assert.equal(report.passed, entry.passed);
    });
}

test("two errors, one warning and one recommendation across FILE and MANIFEST are counted in total and per group", () => {
    const report = ReportBuilderDecidesPassByFailLevel.build(["error", "warning", "error", "recommendation"], "error");

    assert.deepEqual(report.counts, { error: 2, warning: 1, recommendation: 1 });
    assert.deepEqual(report.countsByGroup.FILE, { error: 2, warning: 0, recommendation: 0 });
    assert.deepEqual(report.countsByGroup.MANIFEST, { error: 0, warning: 1, recommendation: 1 });
});

test("one error and one warning appear in the text, json and csv renderings because every renderer lists every finding", () => {
    const report = ReportBuilderDecidesPassByFailLevel.build(["error", "warning"], "error");
    const text = ReportBuilderDecidesPassByFailLevel.renderText(report);
    const json = ReportBuilderDecidesPassByFailLevel.renderJson(report);
    const csv = ReportBuilderDecidesPassByFailLevel.renderCsvLines(report);

    assert.match(text, /error FILE\/201 slug \[BP\/file0\.json\]/);
    assert.match(text, /Result: fail/);
    assert.equal(json.schema_version, ReportBuilderDecidesPassByFailLevel.SCHEMA_VERSION);
    assert.equal((json.findings as unknown[]).length, 2);
    assert.equal(csv.length, 3);
    assert.equal(csv[0], ReportBuilderDecidesPassByFailLevel.CSV_HEADER);
    assert.match(csv[1], /"message with ""quotes"", and comma 0"/);
});

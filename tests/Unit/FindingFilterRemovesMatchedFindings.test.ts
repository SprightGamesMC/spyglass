import assert from "node:assert/strict";
import { test } from "node:test";
import FindingFilterRemovesMatchedFindings from "../Helpers/FindingFilterRemovesMatchedFindings.js";

test("ignore PACK/301 with the texture path removes that finding and keeps the reason", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE, FindingFilterRemovesMatchedFindings.INVALID_JSON],
        [FindingFilterRemovesMatchedFindings.ignore("PACK/301", { path: "RP/textures/entity/boss*.png" })]
    );

    assert.deepEqual(filtered.kept, [FindingFilterRemovesMatchedFindings.INVALID_JSON]);
    assert.deepEqual(filtered.ignored, [
        { finding: FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE, reason: FindingFilterRemovesMatchedFindings.REASON },
    ]);
});

test("ignore PACK/301 with another path keeps the finding because the path does not match", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE],
        [FindingFilterRemovesMatchedFindings.ignore("PACK/301", { path: "RP/textures/blocks/*.png" })]
    );

    assert.equal(filtered.kept.length, 1);
});

test("ignore FILE/201 with the path of the PACK/301 finding keeps it because the ID does not match", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE],
        [FindingFilterRemovesMatchedFindings.ignore("FILE/201", { path: "RP/textures/entity/boss.png" })]
    );

    assert.equal(filtered.kept.length, 1);
});

test("ignore with a path keeps a finding that reports no path", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.PACK_WITHOUT_PATH],
        [FindingFilterRemovesMatchedFindings.ignore("PACK/301", { path: "**" })]
    );

    assert.equal(filtered.kept.length, 1);
});

test("ignore with only an ID removes every finding of that check", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE, FindingFilterRemovesMatchedFindings.PACK_WITHOUT_PATH],
        [FindingFilterRemovesMatchedFindings.ignore("PACK")]
    );

    assert.equal(filtered.kept.length, 0);
});

test("ignore FILE/201 with pack BP and field minecraft:entity removes the finding when both match", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.INVALID_JSON],
        [FindingFilterRemovesMatchedFindings.ignore("FILE/201", { pack: "BP", field: "minecraft:entity" })]
    );

    assert.equal(filtered.kept.length, 0);
});

test("ignore FILE/201 with field format_version keeps the finding because the field does not match", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply(
        [FindingFilterRemovesMatchedFindings.INVALID_JSON],
        [FindingFilterRemovesMatchedFindings.ignore("FILE/201", { field: "format_version" })]
    );

    assert.equal(filtered.kept.length, 1);
});

test("an entry for a check that ran and matched nothing is reported as unused", () => {
    const entry = FindingFilterRemovesMatchedFindings.ignore("PACK/301", { path: "RP/textures/old.png" });
    const filtered = FindingFilterRemovesMatchedFindings.apply([FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE], [entry]);

    assert.deepEqual(filtered.unused, [entry]);
});

test("an entry for a check that was skipped is not reported as unused because the check did not run", () => {
    const filtered = FindingFilterRemovesMatchedFindings.apply([], [FindingFilterRemovesMatchedFindings.ignore("SKIN/101")]);

    assert.deepEqual(filtered.unused, []);
});

test("an ignored error does not fail the run at fail level error", () => {
    const report = FindingFilterRemovesMatchedFindings.report(
        [FindingFilterRemovesMatchedFindings.INVALID_JSON],
        [FindingFilterRemovesMatchedFindings.ignore("FILE/201")]
    );

    assert.equal(report.passed, true);
    assert.equal(report.counts.error, 0);
    assert.deepEqual(report.countsByGroup, {});
});

test("the summary line ends with the ignored count when a finding was ignored", () => {
    const report = FindingFilterRemovesMatchedFindings.report(
        [FindingFilterRemovesMatchedFindings.INVALID_JSON, FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE],
        [FindingFilterRemovesMatchedFindings.ignore("FILE/201")]
    );

    assert.equal(FindingFilterRemovesMatchedFindings.summaryLine(report), "Summary: 0 errors, 1 warnings, 0 recommendations, 1 ignored");
});

test("the summary line has no ignored count when no finding was ignored", () => {
    const report = FindingFilterRemovesMatchedFindings.report([FindingFilterRemovesMatchedFindings.UNUSED_TEXTURE], []);

    assert.equal(FindingFilterRemovesMatchedFindings.summaryLine(report), "Summary: 0 errors, 1 warnings, 0 recommendations");
});

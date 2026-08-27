import assert from "node:assert/strict";
import { test } from "node:test";
import VersionUtilitiesComparesWithSkippedMinors from "../Helpers/VersionUtilitiesComparesWithSkippedMinors.js";

for (const entry of VersionUtilitiesComparesWithSkippedMinors.CASES) {
    test(entry.name, () => {
        const outcome = VersionUtilitiesComparesWithSkippedMinors.compare(entry.version);

        assert.equal(outcome.below, entry.below, "below");
        assert.equal(outcome.above, entry.above, "above");
        assert.equal(outcome.majorMinorBelow, entry.majorMinorBelow, "major minor below");
        assert.equal(outcome.majorMinorAbove, entry.majorMinorAbove, "major minor above");
    });
}

test("parse accepts number arrays and version strings and rejects short arrays, words, and negatives", () => {
    assert.deepEqual(VersionUtilitiesComparesWithSkippedMinors.parseValue([1, 21, 0]), { major: 1, minor: 21, patch: 0 });
    assert.deepEqual(VersionUtilitiesComparesWithSkippedMinors.parseValue("1.21.50-beta.2"), { major: 1, minor: 21, patch: 50 });
    assert.deepEqual(VersionUtilitiesComparesWithSkippedMinors.parseValue("1.21"), { major: 1, minor: 21, patch: 0 });
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.parseValue([1]), undefined);
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.parseValue("latest"), undefined);
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.parseValue([1, -1, 0]), undefined);
});

test("previous minor of 1.26 is 1.21 because 1.22 to 1.25 are unreleased", () => {
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.previousMinor("1.26.0"), 21);
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.previousMinor("1.21.0"), 20);
    assert.equal(VersionUtilitiesComparesWithSkippedMinors.previousMinor("2.23.0"), 22);
});

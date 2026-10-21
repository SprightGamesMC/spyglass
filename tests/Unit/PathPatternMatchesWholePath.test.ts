import assert from "node:assert/strict";
import { test } from "node:test";
import PathPatternMatchesWholePath from "../Helpers/PathPatternMatchesWholePath.js";

for (const entry of PathPatternMatchesWholePath.CASES) {
    test(entry.name, () => {
        assert.equal(PathPatternMatchesWholePath.matches(entry), entry.matches);
    });
}

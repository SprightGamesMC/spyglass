import assert from "node:assert/strict";
import { test } from "node:test";
import TintColorInvalidReportsNonHexValue from "../Helpers/TintColorInvalidReportsNonHexValue.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of TintColorInvalidReportsNonHexValue.CASES) {
    test(TintColorInvalidReportsNonHexValue.ID + " " + entry.name, async () => {
        const findings = await TintColorInvalidReportsNonHexValue.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

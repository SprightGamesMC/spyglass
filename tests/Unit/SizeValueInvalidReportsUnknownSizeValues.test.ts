import assert from "node:assert/strict";
import { test } from "node:test";
import SizeValueInvalidReportsUnknownSizeValues from "../Helpers/SizeValueInvalidReportsUnknownSizeValues.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of SizeValueInvalidReportsUnknownSizeValues.CASES) {
    test(SizeValueInvalidReportsUnknownSizeValues.ID + " " + entry.name, async () => {
        const findings = await SizeValueInvalidReportsUnknownSizeValues.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

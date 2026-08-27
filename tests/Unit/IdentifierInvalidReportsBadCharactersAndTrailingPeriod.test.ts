import assert from "node:assert/strict";
import { test } from "node:test";
import IdentifierInvalidReportsBadCharactersAndTrailingPeriod from "../Helpers/IdentifierInvalidReportsBadCharactersAndTrailingPeriod.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of IdentifierInvalidReportsBadCharactersAndTrailingPeriod.CASES) {
    test(IdentifierInvalidReportsBadCharactersAndTrailingPeriod.ID + " " + entry.name, async () => {
        const findings = await IdentifierInvalidReportsBadCharactersAndTrailingPeriod.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

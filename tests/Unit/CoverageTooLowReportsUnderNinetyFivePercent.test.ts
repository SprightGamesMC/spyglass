import assert from "node:assert/strict";
import { test } from "node:test";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import CoverageTooLowReportsUnderNinetyFivePercent from "../Helpers/CoverageTooLowReportsUnderNinetyFivePercent.js";

for (const entry of CoverageTooLowReportsUnderNinetyFivePercent.CASES) {
    test(CoverageTooLowReportsUnderNinetyFivePercent.ID + " " + entry.name, async () => {
        const findings = await CoverageTooLowReportsUnderNinetyFivePercent.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);
    });
}

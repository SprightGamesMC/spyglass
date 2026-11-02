import assert from "node:assert/strict";
import { test } from "node:test";
import ScaledChildOfScaledParentReportsScaledDescendant from "../Helpers/ScaledChildOfScaledParentReportsScaledDescendant.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of ScaledChildOfScaledParentReportsScaledDescendant.CASES) {
    test(ScaledChildOfScaledParentReportsScaledDescendant.ID + " " + entry.name, async () => {
        const findings = await ScaledChildOfScaledParentReportsScaledDescendant.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}

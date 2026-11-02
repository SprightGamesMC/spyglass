import assert from "node:assert/strict";
import { test } from "node:test";
import RootLandingOffsetReportsHorizontalOffsetAtLanding from "../Helpers/RootLandingOffsetReportsHorizontalOffsetAtLanding.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of RootLandingOffsetReportsHorizontalOffsetAtLanding.CASES) {
    test(RootLandingOffsetReportsHorizontalOffsetAtLanding.ID + " " + entry.name, async () => {
        const findings = await RootLandingOffsetReportsHorizontalOffsetAtLanding.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}

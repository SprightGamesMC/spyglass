import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationTimeQueryUsedReportsQueryUse from "../Helpers/AnimationTimeQueryUsedReportsQueryUse.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimationTimeQueryUsedReportsQueryUse.CASES) {
    test(AnimationTimeQueryUsedReportsQueryUse.ID + " " + entry.name, async () => {
        const findings = await AnimationTimeQueryUsedReportsQueryUse.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

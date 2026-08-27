import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationNameMismatchReportsWrongNameOrMissingKey from "../Helpers/AnimationNameMismatchReportsWrongNameOrMissingKey.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimationNameMismatchReportsWrongNameOrMissingKey.CASES) {
    test(AnimationNameMismatchReportsWrongNameOrMissingKey.ID + " " + entry.name, async () => {
        const findings = await AnimationNameMismatchReportsWrongNameOrMissingKey.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationFileNameInvalidReportsWrongFileName from "../Helpers/AnimationFileNameInvalidReportsWrongFileName.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimationFileNameInvalidReportsWrongFileName.CASES) {
    test(AnimationFileNameInvalidReportsWrongFileName.ID + " " + entry.name, async () => {
        const findings = await AnimationFileNameInvalidReportsWrongFileName.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

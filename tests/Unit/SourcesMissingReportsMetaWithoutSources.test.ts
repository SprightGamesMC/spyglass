import assert from "node:assert/strict";
import { test } from "node:test";
import SourcesMissingReportsMetaWithoutSources from "../Helpers/SourcesMissingReportsMetaWithoutSources.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of SourcesMissingReportsMetaWithoutSources.CASES) {
    test(SourcesMissingReportsMetaWithoutSources.ID + " " + entry.name, async () => {
        const findings = await SourcesMissingReportsMetaWithoutSources.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

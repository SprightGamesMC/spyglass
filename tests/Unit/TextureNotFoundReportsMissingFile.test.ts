import assert from "node:assert/strict";
import { test } from "node:test";
import TextureNotFoundReportsMissingFile from "../Helpers/TextureNotFoundReportsMissingFile.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of TextureNotFoundReportsMissingFile.CASES) {
    test(TextureNotFoundReportsMissingFile.ID + " " + entry.name, async () => {
        const findings = await TextureNotFoundReportsMissingFile.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}

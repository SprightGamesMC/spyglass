import assert from "node:assert/strict";
import { test } from "node:test";
import TextureSetLayerNotFoundReportsMissingLayerFile from "../Helpers/TextureSetLayerNotFoundReportsMissingLayerFile.js";

for (const entry of TextureSetLayerNotFoundReportsMissingLayerFile.CASES) {
    test(TextureSetLayerNotFoundReportsMissingLayerFile.ID + " " + entry.name, async () => {
        const result = await TextureSetLayerNotFoundReportsMissingLayerFile.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
            assert.deepEqual(result.fields, [TextureSetLayerNotFoundReportsMissingLayerFile.FIELD]);
        }
    });
}

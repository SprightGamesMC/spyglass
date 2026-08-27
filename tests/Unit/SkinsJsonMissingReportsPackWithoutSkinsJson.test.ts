import assert from "node:assert/strict";
import { test } from "node:test";
import SkinsJsonMissingReportsPackWithoutSkinsJson from "../Helpers/SkinsJsonMissingReportsPackWithoutSkinsJson.js";

for (const entry of SkinsJsonMissingReportsPackWithoutSkinsJson.CASES) {
    test(SkinsJsonMissingReportsPackWithoutSkinsJson.ID + " " + entry.name, async () => {
        const result = await SkinsJsonMissingReportsPackWithoutSkinsJson.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}

import assert from "node:assert/strict";
import { test } from "node:test";
import SideloadPackMissingReportsAbsentSideloadPack from "../Helpers/SideloadPackMissingReportsAbsentSideloadPack.js";

for (const entry of SideloadPackMissingReportsAbsentSideloadPack.CASES) {
    test(SideloadPackMissingReportsAbsentSideloadPack.ID + " " + entry.name, async () => {
        const result = await SideloadPackMissingReportsAbsentSideloadPack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}

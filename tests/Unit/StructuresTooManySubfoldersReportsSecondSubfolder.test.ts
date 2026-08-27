import assert from "node:assert/strict";
import { test } from "node:test";
import StructuresTooManySubfoldersReportsSecondSubfolder from "../Helpers/StructuresTooManySubfoldersReportsSecondSubfolder.js";

for (const entry of StructuresTooManySubfoldersReportsSecondSubfolder.CASES) {
    test(StructuresTooManySubfoldersReportsSecondSubfolder.ID + " " + entry.name, async () => {
        const found = await StructuresTooManySubfoldersReportsSecondSubfolder.run(entry);

        assert.deepEqual(found, entry.expectedPaths);
    });
}

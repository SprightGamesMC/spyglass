import assert from "node:assert/strict";
import { test } from "node:test";
import PathTooDeepReportsEightFolderSegments from "../Helpers/PathTooDeepReportsEightFolderSegments.js";

for (const entry of PathTooDeepReportsEightFolderSegments.CASES) {
    test(PathTooDeepReportsEightFolderSegments.ID + " " + entry.name, async () => {
        const findings = await PathTooDeepReportsEightFolderSegments.run(entry.folderCount);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        if (entry.expectFinding) {
            assert.equal(findings[0].id, PathTooDeepReportsEightFolderSegments.ID);
            assert.equal(
                findings[0].path,
                PathTooDeepReportsEightFolderSegments.PACK_ROOT + "/" + PathTooDeepReportsEightFolderSegments.packPath(entry.folderCount)
            );
        }
    });
}

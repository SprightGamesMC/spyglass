import assert from "node:assert/strict";
import { test } from "node:test";
import EmoteLayoutsRejectTheOtherInput from "../Helpers/EmoteLayoutsRejectTheOtherInput.js";

for (const entry of EmoteLayoutsRejectTheOtherInput.CASES) {
    test(entry.name, () => {
        const result = EmoteLayoutsRejectTheOtherInput.run(entry);

        assert.equal(result.exitCode, entry.expectedExitCode, result.stderr);

        if (entry.expectedError !== undefined) {
            assert.ok(result.stderr.includes(entry.expectedError), result.stderr);
        }
    });
}

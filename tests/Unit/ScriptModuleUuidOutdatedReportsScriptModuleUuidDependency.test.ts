import assert from "node:assert/strict";
import { test } from "node:test";
import ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency from "../Helpers/ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.js";

for (const entry of ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.CASES) {
    test(ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.ID + " " + entry.name, async () => {
        const result = await ScriptModuleUuidOutdatedReportsScriptModuleUuidDependency.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}

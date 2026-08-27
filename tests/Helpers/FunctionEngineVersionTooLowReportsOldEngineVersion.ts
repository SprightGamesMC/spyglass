import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { FunctionEngineVersionTooLowReportsOldEngineVersionCase } from "../Types/FunctionEngineVersionTooLowReportsOldEngineVersionTypes.js";
import FunctionEngineVersionTooLow from "../../src/Checks/Script/FunctionEngineVersionTooLow.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class FunctionEngineVersionTooLowReportsOldEngineVersion {
    static readonly ID = "SCRIPT/502";
    static readonly MANIFEST_PATH = "BP/manifest.json";
    static readonly CASES: readonly FunctionEngineVersionTooLowReportsOldEngineVersionCase[] = [
        {
            name: "pack with functions and min_engine_version 1.8.0 is at the lowest version that runs them",
            minEngineVersion: [1, 8, 0],
            includeFunction: true,
            expectedIds: [],
        },
        {
            name: "pack with functions and min_engine_version 1.7.0 is below the version that runs them",
            minEngineVersion: [1, 7, 0],
            includeFunction: true,
            expectedIds: ["SCRIPT/502"],
        },
        {
            name: "pack with min_engine_version 1.7.0 and no functions needs no function support",
            minEngineVersion: [1, 7, 0],
            includeFunction: false,
            expectedIds: [],
        },
    ];

    static run(entry: FunctionEngineVersionTooLowReportsOldEngineVersionCase): Promise<Finding[]> {
        const files: Record<string, FixtureFiles[string]> = {
            [FunctionEngineVersionTooLowReportsOldEngineVersion.MANIFEST_PATH]: ModelFixture.withHeader(ModelFixture.behaviorManifest(), {
                min_engine_version: [...entry.minEngineVersion],
            }),
        };

        if (entry.includeFunction) {
            files["BP/functions/spright_cave/hello.mcfunction"] = "say hello";
        }

        return ModelFixture.findings(new FunctionEngineVersionTooLow(), files as FixtureFiles);
    }
}

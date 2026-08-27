import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PathTooLongReportsPackPathOverLimitCase } from "../Types/PathTooLongReportsPackPathOverLimitTypes.js";
import FileLimits from "../../src/Checks/File/FileLimits.js";
import PathTooLong from "../../src/Checks/File/PathTooLong.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class PathTooLongReportsPackPathOverLimit {
    static readonly ID = "FILE/401";
    static readonly PACK_ROOT = "a_very_long_container_folder_name_that_should_not_count/behavior_packs/bp_with_a_long_name";
    static readonly CASES: readonly PathTooLongReportsPackPathOverLimitCase[] = [
        { name: "entities/zombie.json is far under 80 characters", packPath: "entities/zombie.json", expectFinding: false },
        {
            name: "80 character pack path is at the limit",
            packPath: PathTooLongReportsPackPathOverLimit.pathOfLength(FileLimits.PATH_LENGTH_LIMIT),
            expectFinding: false,
        },
        {
            name: "81 character pack path is above the limit",
            packPath: PathTooLongReportsPackPathOverLimit.pathOfLength(FileLimits.PATH_LENGTH_LIMIT + 1),
            expectFinding: true,
        },
    ];

    static pathOfLength(length: number): string {
        const suffix = ".json";
        const prefix = "entities/";

        return prefix + "x".repeat(length - prefix.length - suffix.length) + suffix;
    }

    static run(packPath: string): Promise<Finding[]> {
        const root = PathTooLongReportsPackPathOverLimit.PACK_ROOT;
        const files = { [root + "/manifest.json"]: ModelFixture.behaviorManifest(), [root + "/" + packPath]: "{}" };
        return ModelFixture.findings(new PathTooLong(), files);
    }
}

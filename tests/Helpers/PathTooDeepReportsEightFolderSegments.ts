import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PathTooDeepReportsEightFolderSegmentsCase } from "../Types/PathTooDeepReportsEightFolderSegmentsTypes.js";
import FileLimits from "../../src/Checks/File/FileLimits.js";
import PathTooDeep from "../../src/Checks/File/PathTooDeep.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class PathTooDeepReportsEightFolderSegments {
    static readonly ID = "FILE/402";
    static readonly PACK_ROOT = "outer/behavior_packs/bp";
    static readonly CASES: readonly PathTooDeepReportsEightFolderSegmentsCase[] = [
        { name: "1 folder segment is far under the 7 segment limit", folderCount: 1, expectFinding: false },
        { name: "7 folder segments is at the limit", folderCount: FileLimits.PATH_DEPTH_LIMIT, expectFinding: false },
        { name: "8 folder segments is one above the limit", folderCount: FileLimits.PATH_DEPTH_LIMIT + 1, expectFinding: true },
        { name: "10 folder segments is above the limit", folderCount: FileLimits.PATH_DEPTH_LIMIT + 3, expectFinding: true },
    ];

    static packPath(folderCount: number): string {
        const folders = Array.from({ length: folderCount }, (_, index) => "f" + index);

        return [...folders, "file.json"].join("/");
    }

    static run(folderCount: number): Promise<Finding[]> {
        const root = PathTooDeepReportsEightFolderSegments.PACK_ROOT;
        const packPath = PathTooDeepReportsEightFolderSegments.packPath(folderCount);
        const files = { [root + "/manifest.json"]: ModelFixture.behaviorManifest(), [root + "/" + packPath]: "{}" };
        return ModelFixture.findings(new PathTooDeep(), files);
    }
}

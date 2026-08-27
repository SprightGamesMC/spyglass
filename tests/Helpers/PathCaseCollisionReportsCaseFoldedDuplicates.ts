import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { PathCaseCollisionReportsCaseFoldedDuplicatesCase } from "../Types/PathCaseCollisionReportsCaseFoldedDuplicatesTypes.js";
import PathCaseCollision from "../../src/Checks/File/PathCaseCollision.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class PathCaseCollisionReportsCaseFoldedDuplicates {
    static readonly ID = "FILE/601";
    static readonly CASES: readonly PathCaseCollisionReportsCaseFoldedDuplicatesCase[] = [
        {
            name: "zombie.json and skeleton.json differ by more than letter case",
            paths: ["BP/entities/zombie.json", "BP/entities/skeleton.json"],
            expectFinding: false,
        },
        {
            name: "zombie.json and Zombie.json in one folder differ only by letter case",
            paths: ["BP/entities/zombie.json", "BP/entities/Zombie.json"],
            expectFinding: true,
        },
        {
            name: "entities and Entities folders differ only by letter case",
            paths: ["BP/entities/zombie.json", "BP/Entities/zombie.json"],
            expectFinding: true,
        },
        {
            name: "zombie.json, Zombie.json and ZOMBIE.json share one finding for the case collision",
            paths: ["BP/entities/zombie.json", "BP/entities/Zombie.json", "BP/entities/ZOMBIE.json"],
            expectFinding: true,
        },
    ];

    static run(paths: readonly string[]): Promise<Finding[]> {
        const files: Record<string, string | object> = { "BP/manifest.json": ModelFixture.behaviorManifest() };

        for (const path of paths) {
            files[path] = "{}";
        }

        return ModelFixture.findings(new PathCaseCollision(), files as FixtureFiles);
    }
}

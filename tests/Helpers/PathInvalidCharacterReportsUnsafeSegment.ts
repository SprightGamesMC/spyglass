import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PathInvalidCharacterReportsUnsafeSegmentCase } from "../Types/PathInvalidCharacterReportsUnsafeSegmentTypes.js";
import PathInvalidCharacter from "../../src/Checks/File/PathInvalidCharacter.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class PathInvalidCharacterReportsUnsafeSegment {
    static readonly ID = "FILE/206";
    static readonly CASES: readonly PathInvalidCharacterReportsUnsafeSegmentCase[] = [
        { name: "entities/zombie.json uses only safe characters", path: "entities/zombie.json", expectFinding: false },
        { name: "dollar sign in $zombie.json is not safe on every platform", path: "entities/$zombie.json", expectFinding: true },
        { name: "question mark in zom?bie.json is not safe on every platform", path: "entities/zom?bie.json", expectFinding: true },
        { name: "colon in ent:ities folder is not safe on every platform", path: "ent:ities/zombie.json", expectFinding: true },
        {
            name: "control character code 1 in file name is not safe on every platform",
            path: "entities/zom" + String.fromCharCode(1) + "bie.json",
            expectFinding: true,
        },
        {
            name: "trailing space in entities folder name is not safe on every platform",
            path: "entities /zombie.json",
            expectFinding: true,
        },
        { name: "trailing dot in zombie. file name is not safe on every platform", path: "entities/zombie.", expectFinding: true },
        { name: "con.json uses the reserved Windows device name CON", path: "entities/con.json", expectFinding: true },
        {
            name: "Lpt1 folder uses the reserved Windows device name LPT1 regardless of case",
            path: "Lpt1/zombie.json",
            expectFinding: true,
        },
        { name: "console.json only starts with a reserved name so it is safe", path: "entities/console.json", expectFinding: false },
    ];

    static run(packPath: string): Promise<Finding[]> {
        const files = { "BP/manifest.json": ModelFixture.behaviorManifest(), ["BP/" + packPath]: "{}" };
        return ModelFixture.findings(new PathInvalidCharacter(), files);
    }
}

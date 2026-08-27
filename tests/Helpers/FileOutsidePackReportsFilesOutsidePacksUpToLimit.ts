import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { FileOutsidePackReportsFilesOutsidePacksUpToLimitCase } from "../Types/FileOutsidePackReportsFilesOutsidePacksUpToLimitTypes.js";
import FileOutsidePack from "../../src/Checks/Pack/FileOutsidePack.js";
import PackLimits from "../../src/Checks/Pack/PackLimits.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class FileOutsidePackReportsFilesOutsidePacksUpToLimit {
    static readonly ID = "PACK/204";
    static readonly CASES: readonly FileOutsidePackReportsFilesOutsidePacksUpToLimitCase[] = [
        { name: "every file inside a pack gives no file outside a pack", outsideCount: 0, expectedFindings: 0 },
        { name: "one file under outside is not in any pack", outsideCount: 1, expectedFindings: 1 },
        {
            name: "8 files outside every pack are limited to 5 findings",
            outsideCount: PackLimits.FILE_OUTSIDE_PACK_FINDING_LIMIT + 3,
            expectedFindings: PackLimits.FILE_OUTSIDE_PACK_FINDING_LIMIT,
        },
    ];

    static run(outsideCount: number): Promise<Finding[]> {
        const files: Record<string, string | object> = { "BP/manifest.json": ModelFixture.behaviorManifest(), "BP/entities/a.json": "{}" };

        for (let index = 0; index < outsideCount; index++) {
            files["outside/file" + index + ".txt"] = "x";
        }

        return ModelFixture.findings(new FileOutsidePack(), files as FixtureFiles);
    }
}

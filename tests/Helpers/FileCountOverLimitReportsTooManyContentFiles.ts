import type { Finding } from "../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { FileCountOverLimitReportsTooManyContentFilesCase } from "../Types/FileCountOverLimitReportsTooManyContentFilesTypes.js";
import FileCountOverLimit from "../../src/Checks/Pack/FileCountOverLimit.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class FileCountOverLimitReportsTooManyContentFiles {
    static readonly ID = "PACK/402";
    static readonly LIMIT = 3;
    static readonly CASES: readonly FileCountOverLimitReportsTooManyContentFilesCase[] = [
        { name: "1 file is below the 3 file limit", fileCount: 1, expectFinding: false },
        { name: "3 files is at the 3 file limit", fileCount: FileCountOverLimitReportsTooManyContentFiles.LIMIT, expectFinding: false },
        {
            name: "4 files is above the 3 file limit",
            fileCount: FileCountOverLimitReportsTooManyContentFiles.LIMIT + 1,
            expectFinding: true,
        },
        {
            name: "3 pack files and 2 files outside packs is at the limit because files outside packs do not count",
            fileCount: FileCountOverLimitReportsTooManyContentFiles.LIMIT,
            outsideCount: 2,
            expectFinding: false,
        },
    ];

    static run(entry: FileCountOverLimitReportsTooManyContentFilesCase): Promise<Finding[]> {
        const files: Record<string, string | object> = { "BP/manifest.json": ModelFixture.behaviorManifest() };

        for (let index = 1; index < entry.fileCount; index++) {
            files["BP/functions/f" + index + ".mcfunction"] = "";
        }

        for (let index = 0; index < (entry.outsideCount ?? 0); index++) {
            files["outside/file" + index + ".txt"] = "";
        }

        const check = new FileCountOverLimit(FileCountOverLimitReportsTooManyContentFiles.LIMIT);
        return ModelFixture.findings(check, files as FixtureFiles);
    }
}

import type { FileCountOverLimitReportsAddonAboveFileLimitCase } from "../Types/FileCountOverLimitReportsAddonAboveFileLimitTypes.js";
import FileCountOverLimit from "../../src/Checks/Addon/FileCountOverLimit.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class FileCountOverLimitReportsAddonAboveFileLimit {
    static readonly ID = "ADDON/404";
    static readonly CASES: readonly FileCountOverLimitReportsAddonAboveFileLimitCase[] = [
        { name: "two structures plus the manifest are under the 3500 file limit", fileCount: 2, fileSize: 1, artSize: 0, expectedIds: [] },
        {
            name: "3500 structures plus the manifest is above the 3500 file limit",
            fileCount: 3500,
            fileSize: 1,
            artSize: 0,
            expectedIds: ["ADDON/404"],
        },
    ];

    static async run(entry: FileCountOverLimitReportsAddonAboveFileLimitCase): Promise<string[]> {
        const summary = await AddonFixture.run(new FileCountOverLimit(), AddonFixture.sizedFiles(entry));

        return summary.ids;
    }
}

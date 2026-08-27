import type { SizeOverLimitReportsAddonAboveByteLimitCase } from "../Types/SizeOverLimitReportsAddonAboveByteLimitTypes.js";
import SizeOverLimit from "../../src/Checks/Addon/SizeOverLimit.js";
import AddonFixture from "./Core/AddonFixture.js";

export default abstract class SizeOverLimitReportsAddonAboveByteLimit {
    static readonly ID = "ADDON/403";
    static readonly CASES: readonly SizeOverLimitReportsAddonAboveByteLimitCase[] = [
        { name: "two files of 10 bytes are under the size limit", fileCount: 2, fileSize: 10, artSize: 0, expectedIds: [] },
        {
            name: "26 MB of marketing art is excluded from the content size",
            fileCount: 1,
            fileSize: 10,
            artSize: 26_000_000,
            expectedIds: [],
        },
        {
            name: "one file of 25000001 bytes is above the 25000000 byte size limit",
            fileCount: 1,
            fileSize: 25_000_001,
            artSize: 0,
            expectedIds: ["ADDON/403"],
        },
    ];

    static async run(entry: SizeOverLimitReportsAddonAboveByteLimitCase): Promise<string[]> {
        const summary = await AddonFixture.run(new SizeOverLimit(), AddonFixture.sizedFiles(entry));

        return summary.ids;
    }
}

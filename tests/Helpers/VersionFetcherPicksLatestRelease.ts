import type { LatestReleaseCase } from "../Types/VersionFetcherPicksLatestReleaseTypes.js";
import VersionFetcher from "../../src/Cli/VersionFetcher.js";

export default abstract class VersionFetcherPicksLatestRelease {
    static readonly CASES: readonly LatestReleaseCase[] = [
        {
            name: "patch 100 is newer than patch 90 because parts compare as numbers",
            versions: ["10.30.90.3", "10.30.100.1"],
            expected: "10.30.100",
        },
        {
            name: "minor 31 is newer than minor 30 with a larger patch because minor is compared first",
            versions: ["10.30.100.1", "10.31.0.5"],
            expected: "10.31.0",
        },
        {
            name: "fourth part at the preview threshold is a preview and is skipped",
            versions: ["10.30.0.1", "10.31.0.20"],
            expected: "10.30.0",
        },
        { name: "no entry with a three part version gives no release", versions: ["10.30", "text"], expected: undefined },
    ];

    static pick(versions: readonly string[]): string | undefined {
        const body: Record<string, unknown> = {};

        versions.forEach((version, index) => {
            body["entry" + index] = { version };
        });

        try {
            return VersionFetcher.pickLatestRelease(body);
        } catch {
            return undefined;
        }
    }
}

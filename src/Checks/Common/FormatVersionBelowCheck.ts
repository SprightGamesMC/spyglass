import type { GameVersion } from "../../Types/LoaderTypes.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import FormatVersionComparisonCheck from "./FormatVersionComparisonCheck.js";

export default abstract class FormatVersionBelowCheck extends FormatVersionComparisonCheck {
    protected violates(version: GameVersion, expected: GameVersion, exactly: boolean): boolean {
        if (exactly) {
            return VersionUtilities.compare(version, expected) < 0;
        }

        return VersionUtilities.isBelowCurrent(version, expected);
    }

    protected describe(actual: string, expected: string): string {
        return "format_version " + actual + " is below the expected version " + expected;
    }
}

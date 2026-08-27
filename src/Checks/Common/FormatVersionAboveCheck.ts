import type { GameVersion } from "../../Types/LoaderTypes.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import FormatVersionComparisonCheck from "./FormatVersionComparisonCheck.js";

export default abstract class FormatVersionAboveCheck extends FormatVersionComparisonCheck {
    protected violates(version: GameVersion, expected: GameVersion, exactly: boolean): boolean {
        if (exactly) {
            return VersionUtilities.compare(version, expected) > 0;
        }

        return VersionUtilities.isAboveCurrent(version, expected);
    }

    protected describe(actual: string, expected: string): string {
        return "format_version " + actual + " is above the expected version " + expected;
    }
}

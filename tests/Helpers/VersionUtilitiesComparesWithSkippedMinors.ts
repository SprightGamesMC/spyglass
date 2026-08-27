import type { GameVersion } from "../../src/Types/LoaderTypes.js";
import type { VersionCase, VersionOutcome } from "../Types/VersionUtilitiesComparesWithSkippedMinorsTypes.js";
import VersionUtilities from "../../src/Loaders/VersionUtilities.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class VersionUtilitiesComparesWithSkippedMinors {
    static readonly CURRENT = ModelFixture.FICTIONAL_GAME_VERSION;
    static readonly CASES: readonly VersionCase[] = [
        {
            name: "10.30.20 equals current 10.30.20",
            version: ModelFixture.FICTIONAL_GAME_VERSION,
            below: false,
            above: false,
            majorMinorBelow: false,
            majorMinorAbove: false,
        },
        {
            name: "10.29.0 is the previous minor of 10.30.20 and is allowed",
            version: "10.29.0",
            below: false,
            above: false,
            majorMinorBelow: false,
            majorMinorAbove: false,
        },
        {
            name: "10.28.0 is below the previous minor of 10.30.20",
            version: "10.28.0",
            below: true,
            above: false,
            majorMinorBelow: true,
            majorMinorAbove: false,
        },
        {
            name: "10.31.0 is a minor above 10.30.20",
            version: "10.31.0",
            below: false,
            above: true,
            majorMinorBelow: false,
            majorMinorAbove: true,
        },
        {
            name: "10.30.30 is a patch above 10.30.20 within the same minor",
            version: "10.30.30",
            below: false,
            above: true,
            majorMinorBelow: false,
            majorMinorAbove: false,
        },
        {
            name: "10.30.10 is a patch below 10.30.20 within the same minor",
            version: "10.30.10",
            below: true,
            above: false,
            majorMinorBelow: false,
            majorMinorAbove: false,
        },
        {
            name: "11.0.0 is a major above 10.30.20",
            version: "11.0.0",
            below: false,
            above: true,
            majorMinorBelow: false,
            majorMinorAbove: true,
        },
        {
            name: "9.9.0 is a major below 10.30.20",
            version: "9.9.0",
            below: true,
            above: false,
            majorMinorBelow: true,
            majorMinorAbove: false,
        },
    ];

    static compare(text: string): VersionOutcome {
        const version = VersionUtilitiesComparesWithSkippedMinors.parse(text);
        const current = VersionUtilitiesComparesWithSkippedMinors.parse(VersionUtilitiesComparesWithSkippedMinors.CURRENT);

        return {
            below: VersionUtilities.isBelowCurrent(version, current),
            above: VersionUtilities.isAboveCurrent(version, current),
            majorMinorBelow: VersionUtilities.isMajorMinorBelow(version, current),
            majorMinorAbove: VersionUtilities.isMajorMinorAbove(version, current),
        };
    }

    static parseValue(value: unknown): GameVersion | undefined {
        return VersionUtilities.parse(value as never);
    }

    static previousMinor(text: string): number {
        return VersionUtilities.previousMinor(VersionUtilitiesComparesWithSkippedMinors.parse(text));
    }

    private static parse(text: string): GameVersion {
        const parsed = VersionUtilities.parseString(text);

        if (parsed === undefined) {
            throw new Error("Bad version " + text);
        }

        return parsed;
    }
}

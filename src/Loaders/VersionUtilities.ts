import type { GameVersion, JsonValue } from "../Types/LoaderTypes.js";

export default abstract class VersionUtilities {
    private static readonly UNRELEASED_MINORS: readonly number[] = [22, 23, 24, 25];
    private static readonly UNRELEASED_MINOR_MAJOR = 1;

    static parse(value: JsonValue | undefined): GameVersion | undefined {
        if (typeof value === "string") {
            return VersionUtilities.parseString(value);
        }

        if (!Array.isArray(value) || value.length < 2 || value.length > 4) {
            return undefined;
        }

        if (!value.every((part) => typeof part === "number" && Number.isInteger(part) && part >= 0)) {
            return undefined;
        }

        const parts = value as number[];

        return { major: parts[0], minor: parts[1], patch: parts[2] ?? 0 };
    }

    static parseString(text: string): GameVersion | undefined {
        const trimmed = text.trim();
        const match = /^v?(\d+)\.(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-[0-9A-Za-z.-]+)?$/.exec(trimmed);

        if (match === null) {
            return undefined;
        }

        return { major: Number(match[1]), minor: Number(match[2]), patch: match[3] === undefined ? 0 : Number(match[3]) };
    }

    static format(version: GameVersion): string {
        return version.major + "." + version.minor + "." + version.patch;
    }

    static compare(left: GameVersion, right: GameVersion): number {
        const majorMinor = VersionUtilities.compareMajorMinor(left, right);

        if (majorMinor !== 0) {
            return majorMinor;
        }

        return left.patch - right.patch;
    }

    static compareMajorMinor(left: GameVersion, right: GameVersion): number {
        if (left.major !== right.major) {
            return left.major - right.major;
        }

        return left.minor - right.minor;
    }

    static previousMinor(version: GameVersion): number {
        let minor = version.minor - 1;

        while (
            version.major === VersionUtilities.UNRELEASED_MINOR_MAJOR &&
            VersionUtilities.UNRELEASED_MINORS.includes(minor) &&
            minor > 0
        ) {
            minor -= 1;
        }

        return minor;
    }

    static isBelowCurrent(version: GameVersion, current: GameVersion): boolean {
        if (VersionUtilities.isMajorMinorBelow(version, current)) {
            return true;
        }

        return version.major === current.major && version.minor === current.minor && version.patch < current.patch;
    }

    static isAboveCurrent(version: GameVersion, current: GameVersion): boolean {
        if (VersionUtilities.compareMajorMinor(version, current) > 0) {
            return true;
        }

        return version.minor === current.minor && version.major === current.major && version.patch > current.patch;
    }

    static isMajorMinorBelow(version: GameVersion, current: GameVersion): boolean {
        if (version.major < current.major) {
            return true;
        }

        return version.major === current.major && version.minor < VersionUtilities.previousMinor(current);
    }

    static isMajorMinorAbove(version: GameVersion, current: GameVersion): boolean {
        return VersionUtilities.compareMajorMinor(version, current) > 0;
    }
}

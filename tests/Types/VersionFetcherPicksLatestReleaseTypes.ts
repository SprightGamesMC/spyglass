export interface LatestReleaseCase {
    readonly name: string;
    readonly versions: readonly string[];
    readonly expected: string | undefined;
}

export interface VersionOutcome {
    readonly below: boolean;
    readonly above: boolean;
    readonly majorMinorBelow: boolean;
    readonly majorMinorAbove: boolean;
}

export interface VersionCase extends VersionOutcome {
    readonly name: string;
    readonly version: string;
}

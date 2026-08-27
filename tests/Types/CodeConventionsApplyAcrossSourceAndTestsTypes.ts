export interface SourceFile {
    readonly path: string;
    readonly text: string;
}

export interface ConventionViolation {
    readonly path: string;
    readonly line: number;
    readonly rule: string;
}

export interface VersionPair {
    readonly toolVersion: string;
    readonly packageVersion: string;
}

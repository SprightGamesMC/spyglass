import type { FixtureFiles } from "./FixtureTypes.js";

export interface DependencyCase {
    readonly name: string;
    readonly behaviorDependencies?: readonly Record<string, unknown>[];
    readonly resourceDependencies?: readonly Record<string, unknown>[];
    readonly expectedIds: readonly string[];
}

export interface DependencyFieldCase extends DependencyCase {
    readonly expectedFields: readonly string[];
}

export interface PackPathCase {
    readonly name: string;
    readonly packType: "behavior" | "resource";
    readonly paths: readonly string[];
    readonly expectedPaths: readonly string[];
}

export interface FilesCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedIds: readonly string[];
}

export interface SizeCase {
    readonly name: string;
    readonly fileCount: number;
    readonly fileSize: number;
    readonly artSize: number;
    readonly expectedIds: readonly string[];
}

export interface PackFileCase {
    readonly name: string;
    readonly path: string;
    readonly content: object;
    readonly expectedFields: readonly string[];
}

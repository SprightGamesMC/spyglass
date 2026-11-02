import type { Finding } from "../../src/Types/CheckTypes.js";

export interface EmoteProjectStorageConvertsProjectToExportedFilesResult {
    readonly paths: readonly string[];
    readonly meta: Record<string, unknown>;
    readonly animation: Record<string, unknown>;
    readonly lang: string;
}

export type EmoteProjectStorageConvertsProjectToExportedFilesFindings = readonly Finding[];

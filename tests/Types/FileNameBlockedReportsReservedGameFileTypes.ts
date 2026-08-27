import type { PackType } from "../../src/Types/ModelTypes.js";

export interface FileNameBlockedReportsReservedGameFileCase {
    readonly name: string;
    readonly packType: PackType;
    readonly packPath: string;
    readonly expectFinding: boolean;
}

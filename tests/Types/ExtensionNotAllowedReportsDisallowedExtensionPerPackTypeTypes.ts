import type { PackType } from "../../src/Types/ModelTypes.js";

export interface ExtensionNotAllowedReportsDisallowedExtensionPerPackTypeCase {
    readonly name: string;
    readonly packType: PackType;
    readonly fileName: string;
    readonly expectFinding: boolean;
}

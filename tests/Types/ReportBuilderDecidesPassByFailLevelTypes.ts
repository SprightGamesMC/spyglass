import type { Severity } from "../../src/Types/CheckTypes.js";
import type { FailOn } from "../../src/Types/ReportTypes.js";

export interface PassCase {
    readonly severities: readonly Severity[];
    readonly failOn: FailOn;
    readonly passed: boolean;
}

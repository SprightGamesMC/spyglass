import type { Severity } from "../../src/Types/CheckTypes.js";

export interface SummaryColorCase {
    readonly severity: Severity;
    readonly label: string;
}

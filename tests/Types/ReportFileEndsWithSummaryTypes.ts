import type { ReportFormat } from "../../src/Types/ReportTypes.js";

export interface ReportFileCase {
    readonly name: string;
    readonly format: ReportFormat;
    readonly fileName: string;
    readonly endsWithSummary: boolean;
}

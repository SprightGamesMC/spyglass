import type { Report } from "../../Types/ReportTypes.js";

export default abstract class CsvReporter {
    static readonly HEADER = "id,slug,severity,path,pack,field,line,message";

    static render(report: Report): string {
        const rows = report.findings.map((finding) =>
            [
                finding.id,
                finding.slug,
                finding.severity,
                finding.path ?? "",
                finding.pack ?? "",
                finding.location?.field ?? "",
                finding.location?.line === undefined ? "" : String(finding.location.line),
                finding.message,
            ]
                .map(CsvReporter.escape)
                .join(",")
        );

        return [CsvReporter.HEADER, ...rows].join("\n") + "\n";
    }

    private static escape(value: string): string {
        if (!/[",\n\r]/.test(value)) {
            return value;
        }

        return '"' + value.replaceAll('"', '""') + '"';
    }
}

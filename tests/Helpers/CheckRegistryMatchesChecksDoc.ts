import type { DocumentedCheck, RegistryDifference } from "../Types/CheckRegistryMatchesChecksDocTypes.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import CheckIds from "../../src/Checks/CheckIds.js";
import CheckRegistry from "../../src/Checks/CheckRegistry.js";

export default abstract class CheckRegistryMatchesChecksDoc {
    static readonly DOC_FOLDER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "docs", "checks");
    static readonly ROW_PATTERN = /^\| ([A-Z]+\/\d+) \| ([a-z0-9-]+) \| (error|warning|recommendation) \| (.+) \|$/;

    static documented(): DocumentedCheck[] {
        const rows: DocumentedCheck[] = [];

        for (const line of CheckRegistryMatchesChecksDoc.lines()) {
            const match = CheckRegistryMatchesChecksDoc.ROW_PATTERN.exec(line);

            if (match !== null) {
                rows.push({ id: match[1], slug: match[2], severity: match[3], description: match[4].trim().replaceAll("`", "") });
            }
        }

        return rows;
    }

    static lines(): string[] {
        const folder = CheckRegistryMatchesChecksDoc.DOC_FOLDER;
        const pages = fs
            .readdirSync(folder)
            .filter((name) => name.endsWith(".md"))
            .sort();

        return pages.flatMap((name) => fs.readFileSync(path.join(folder, name), "utf-8").split(/\r?\n/));
    }

    static differences(): RegistryDifference[] {
        const documented = CheckRegistryMatchesChecksDoc.documented();
        const registered = new Map(CheckRegistry.definitions().map((definition) => [CheckIds.of(definition), definition]));
        const differences: RegistryDifference[] = [];

        for (const row of documented) {
            const definition = registered.get(row.id);

            if (definition === undefined) {
                differences.push({ id: row.id, problem: "documented but not registered" });
                continue;
            }

            if (definition.slug !== row.slug) {
                differences.push({ id: row.id, problem: "slug " + definition.slug + " differs from doc " + row.slug });
            }

            if (definition.severity !== row.severity) {
                differences.push({ id: row.id, problem: "severity " + definition.severity + " differs from doc " + row.severity });
            }

            if (definition.description !== row.description) {
                differences.push({ id: row.id, problem: "description differs from doc: " + definition.description });
            }
        }

        const documentedIds = new Set(documented.map((row) => row.id));

        for (const id of registered.keys()) {
            if (!documentedIds.has(id)) {
                differences.push({ id, problem: "registered but not documented" });
            }
        }

        return differences.sort((left, right) => CheckIds.compare(left.id, right.id));
    }
}

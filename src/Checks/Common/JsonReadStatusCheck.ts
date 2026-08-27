import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonReadResult } from "../../Types/LoaderTypes.js";
import type { FileEntry } from "../../Types/StorageTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";

export default abstract class JsonReadStatusCheck extends Check {
    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.allFiles) {
            if (PathUtilities.extension(file.path) !== "json") {
                continue;
            }

            const result = await context.loaders.json.read(file.path);

            if (!this.matches(result)) {
                continue;
            }

            findings.push(this.finding(this.message(file, result), file.path));
        }

        return findings;
    }

    protected abstract matches(result: JsonReadResult): boolean;

    protected abstract message(file: FileEntry, result: JsonReadResult): string;
}

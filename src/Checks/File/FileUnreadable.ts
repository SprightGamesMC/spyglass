import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ToolError from "../../Errors/ToolError.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";

export default class FileUnreadable extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.FILE_UNREADABLE,
        slug: "file-unreadable",
        severity: "error",
        description: "File exists but its bytes could not be read",
    };

    private static async readError(context: CheckContext, path: string): Promise<string | undefined> {
        if (PathUtilities.extension(path) === "json") {
            const result = await context.loaders.json.read(path);

            return result.status === "unreadable" ? (result.error ?? "read error") : undefined;
        }

        try {
            await context.model.storage.readBytes(path);
        } catch (error) {
            return ToolError.describe(error);
        }

        return undefined;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const file of context.model.allFiles) {
            const error = await FileUnreadable.readError(context, file.path);

            if (error === undefined) {
                continue;
            }

            findings.push(this.finding("File could not be read: " + error, file.path));
        }

        return findings;
    }
}

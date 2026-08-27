import type { CheckContext } from "../Types/CheckTypes.js";
import type { FormatVersionResult } from "../Types/FormatVersionTypes.js";
import JsonKeys from "../Data/JsonKeys.js";
import JsonLoader from "./JsonLoader.js";
import VersionUtilities from "./VersionUtilities.js";

export default abstract class FormatVersionReader {
    static async read(context: CheckContext, path: string): Promise<FormatVersionResult> {
        const result = await context.loaders.json.read(path);

        if (result.status !== "ok" || !JsonLoader.isObject(result.value)) {
            return { status: "skipped" };
        }

        const field = result.value[JsonKeys.FORMAT_VERSION];

        if (field === undefined) {
            return { status: "missing" };
        }

        const version = VersionUtilities.parse(field);

        if (version === undefined) {
            return { status: "unparseable", text: JSON.stringify(field) };
        }

        return { status: "ok", version };
    }
}

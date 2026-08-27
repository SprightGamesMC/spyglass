import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { FormatVersionResult } from "../../Types/FormatVersionTypes.js";
import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import JsonKeys from "../../Data/JsonKeys.js";
import FormatVersionReader from "../../Loaders/FormatVersionReader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";

export default abstract class FormatVersionMissingCheck extends Check {
    protected abstract readonly kinds: readonly ItemKind[];
    protected readonly packType?: PackType;

    private static describe(result: FormatVersionResult): string | undefined {
        if (result.status === "missing") {
            return "No parseable format_version";
        }

        if (result.status === "unparseable") {
            return "format_version " + result.text + " is not a version";
        }

        return undefined;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, this.kinds, this.packType)) {
            const message = FormatVersionMissingCheck.describe(await FormatVersionReader.read(context, item.path));

            if (message === undefined) {
                continue;
            }

            findings.push(this.finding(message, item.path, pack.root, { field: JsonKeys.FORMAT_VERSION }));
        }

        return findings;
    }
}

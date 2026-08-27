import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { SkinPackDefinition } from "../../Types/SkinTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class LocKeyMissing extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.LOC_KEY_MISSING,
        slug: "loc-key-missing",
        severity: "error",
        description: "skins.json key not found in en_US.lang",
    };

    private static async readEnglishKeys(context: CheckContext, definition: SkinPackDefinition): Promise<Set<string>> {
        const item = SkinPackLoader.langItems(definition.pack).find(
            (candidate) => PathUtilities.fileName(candidate.packPath).toLowerCase() === SkinLimits.ENGLISH_LANG_FILE.toLowerCase()
        );

        if (item === undefined) {
            return new Set();
        }

        const entries = await context.loaders.text.readLangEntries(item.path);

        return new Set(entries?.keys() ?? []);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            findings.push(...(await this.checkDefinition(context, definition)));
        }

        return findings;
    }

    private async checkDefinition(context: CheckContext, definition: SkinPackDefinition): Promise<Finding[]> {
        const known = await LocKeyMissing.readEnglishKeys(context, definition);

        return SkinPackLoader.expectedLangKeys(definition)
            .filter((key) => !known.has(key))
            .map((key) =>
                this.finding(
                    "Key " + key + " from skins.json is not in texts/" + SkinLimits.ENGLISH_LANG_FILE,
                    definition.path,
                    definition.pack.root
                )
            );
    }
}

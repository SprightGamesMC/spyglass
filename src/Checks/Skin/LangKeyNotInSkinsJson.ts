import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class LangKeyNotInSkinsJson extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.LANG_KEY_NOT_IN_SKINS_JSON,
        slug: "lang-key-not-in-skins-json",
        severity: "error",
        description: "Skin .lang key has no matching skin",
    };

    private static isSkinKey(key: string): boolean {
        return key.startsWith(SkinPackLoader.SKIN_KEY_PREFIX) || key.startsWith(SkinPackLoader.PACK_KEY_PREFIX);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            if (definition.serializeName === undefined) {
                continue;
            }

            const expected = new Set(SkinPackLoader.expectedLangKeys(definition));
            expected.add(SkinPackLoader.PACK_KEY_PREFIX + definition.serializeName + SkinPackLoader.PACK_ATTRIBUTION_SUFFIX);

            for (const item of SkinPackLoader.langItems(definition.pack)) {
                const entries = await context.loaders.text.readLangEntries(item.path);

                for (const key of entries?.keys() ?? []) {
                    if (!LangKeyNotInSkinsJson.isSkinKey(key) || expected.has(key)) {
                        continue;
                    }

                    findings.push(
                        this.finding("Key " + key + " has no matching skin or pack in skins.json", item.path, definition.pack.root)
                    );
                }
            }
        }

        return findings;
    }
}

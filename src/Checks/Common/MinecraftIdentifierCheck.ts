import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind, PackType } from "../../Types/ModelTypes.js";
import Namespaces from "../../Data/Namespaces.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";

export default abstract class MinecraftIdentifierCheck extends Check {
    protected abstract readonly kinds: readonly ItemKind[];
    protected readonly packType?: PackType;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, this.kinds, this.packType)) {
            const value = await context.loaders.json.readValue(item.path);
            const fieldPath = this.fieldPathFor(item, value);

            if (fieldPath === undefined) {
                continue;
            }

            const identifier = JsonLoader.get(value, ...fieldPath);

            if (typeof identifier !== "string" || !identifier.toLowerCase().startsWith(Namespaces.VANILLA)) {
                continue;
            }

            const field = fieldPath[fieldPath.length - 1];
            const message = field + " " + identifier + " uses the minecraft namespace";

            findings.push(this.finding(message, item.path, pack.root, { field: fieldPath.join(".") }));
        }

        return findings;
    }

    protected abstract fieldPathFor(item: ContentItem, value: JsonValue | undefined): readonly string[] | undefined;
}

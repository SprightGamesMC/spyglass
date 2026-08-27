import type { CheckContext } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { ContentItem } from "../../Types/ModelTypes.js";
import type { PackReferenceEntry } from "../../Types/WorldTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import WorldLimits from "./WorldLimits.js";

export default abstract class PackReferenceFiles {
    static items(context: CheckContext): ContentItem[] {
        return context.model.worlds
            .flatMap((world) => world.items)
            .filter((item) => item.kind === "world_behavior_packs" || item.kind === "world_resource_packs");
    }

    static async readObjectEntries(context: CheckContext, item: ContentItem): Promise<PackReferenceEntry[]> {
        const entries = (await PackReferenceFiles.readEntries(context, item)) ?? [];

        return entries
            .map((entry, index) => ({ index, entry }))
            .filter((pair): pair is PackReferenceEntry => JsonLoader.isObject(pair.entry));
    }

    static isValidVersion(value: JsonValue | undefined): boolean {
        if (typeof value === "string") {
            return VersionUtilities.parseString(value) !== undefined;
        }

        if (!JsonLoader.isArray(value) || value.length !== WorldLimits.PACK_REFERENCE_VERSION_LENGTH) {
            return false;
        }

        return value.every((part) => typeof part === "number" && Number.isInteger(part) && part >= 0);
    }

    static entryField(index: number, name: string): string {
        return "[" + index + "]." + name;
    }

    private static async readEntries(context: CheckContext, item: ContentItem): Promise<JsonValue[] | undefined> {
        const result = await context.loaders.json.read(item.path);

        if (result.status !== "ok" || !JsonLoader.isArray(result.value)) {
            return undefined;
        }

        return result.value;
    }
}

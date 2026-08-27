import type Loaders from "../../Loaders/Loaders.js";
import type { PackReferenceFile } from "../../Types/MarketplaceTypes.js";
import type { ContentModel, ItemKind, Pack, World } from "../../Types/ModelTypes.js";
import type { PackReferenceEntry } from "../../Types/WorldTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default abstract class WorldPackReferences {
    static collect(model: ContentModel): PackReferenceFile[] {
        const references: PackReferenceFile[] = [];

        for (const world of model.worlds) {
            for (const pack of world.packs) {
                const reference = WorldPackReferences.forPack(world, pack);

                if (reference !== undefined) {
                    references.push(reference);
                }
            }
        }

        return references;
    }

    static async entries(loaders: Loaders, path: string): Promise<PackReferenceEntry[]> {
        const value = await loaders.json.readValue(path);

        if (!JsonLoader.isArray(value)) {
            return [];
        }

        const entries: PackReferenceEntry[] = [];

        value.forEach((entry, index) => {
            if (JsonLoader.isObject(entry)) {
                entries.push({ index, entry });
            }
        });

        return entries;
    }

    static findEntry(entries: readonly PackReferenceEntry[], uuid: string): PackReferenceEntry | undefined {
        const wanted = uuid.toLowerCase();

        return entries.find((candidate) => {
            const packId = candidate.entry.pack_id;

            return typeof packId === "string" && packId.toLowerCase() === wanted;
        });
    }

    private static forPack(world: World, pack: Pack): PackReferenceFile | undefined {
        const fileName = WorldPackReferences.fileNameFor(pack);
        const kind = WorldPackReferences.kindFor(pack);

        if (fileName === undefined || kind === undefined) {
            return undefined;
        }

        const expectedPath = PathUtilities.join(world.root, fileName);
        const item = world.items.find((entry) => entry.kind === kind && entry.packPath.toLowerCase() === fileName);

        return { pack, expectedPath, path: item?.path };
    }

    private static fileNameFor(pack: Pack): string | undefined {
        if (pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return MarketplaceLimits.WORLD_BEHAVIOR_PACKS_FILE;
        }

        if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE) {
            return MarketplaceLimits.WORLD_RESOURCE_PACKS_FILE;
        }

        return undefined;
    }

    private static kindFor(pack: Pack): ItemKind | undefined {
        if (pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return "world_behavior_packs";
        }

        if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE) {
            return "world_resource_packs";
        }

        return undefined;
    }
}

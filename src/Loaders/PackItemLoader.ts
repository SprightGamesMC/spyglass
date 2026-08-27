import type { PackItem } from "../Types/DefinitionTypes.js";
import type { ContentModel, ItemKind, Pack, PackType } from "../Types/ModelTypes.js";

export default abstract class PackItemLoader {
    static readonly BEHAVIOR_PACK_TYPE: PackType = "behavior";
    static readonly RESOURCE_PACK_TYPE: PackType = "resource";
    static readonly SKIN_PACK_TYPE: PackType = "skin";
    static readonly PERSONA_PACK_TYPE: PackType = "persona";
    static readonly WORLD_TEMPLATE_PACK_TYPE: PackType = "world_template";
    static readonly CONTENT_PACK_TYPES: readonly PackType[] = [PackItemLoader.BEHAVIOR_PACK_TYPE, PackItemLoader.RESOURCE_PACK_TYPE];

    static contentPacks(model: ContentModel): Pack[] {
        return model.packs.filter((pack) => PackItemLoader.CONTENT_PACK_TYPES.includes(pack.type));
    }

    static select(model: ContentModel, kinds: readonly ItemKind[], packType?: PackType): PackItem[] {
        const selected: PackItem[] = [];

        for (const pack of model.packs) {
            if (packType !== undefined && pack.type !== packType) {
                continue;
            }

            for (const item of pack.items) {
                if (kinds.includes(item.kind)) {
                    selected.push({ pack, item });
                }
            }
        }

        return selected;
    }
}

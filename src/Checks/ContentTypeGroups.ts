import type { CheckGroup, ContentType, Layout } from "../Types/CheckTypes.js";

export default abstract class ContentTypeGroups {
    static readonly SHARED_PACK_GROUPS: readonly CheckGroup[] = [
        "FILE",
        "PACK",
        "MANIFEST",
        "LANG",
        "TEXTURE",
        "MODEL",
        "SOUND",
        "PARTICLE",
        "SCRIPT",
        "ENTITY",
        "BLOCK",
        "DEFINITION",
    ];

    static readonly ADDON_GROUPS: readonly CheckGroup[] = [...ContentTypeGroups.SHARED_PACK_GROUPS, "ADDON"];

    static readonly WORLD_GROUPS: readonly CheckGroup[] = [...ContentTypeGroups.SHARED_PACK_GROUPS, "WORLD", "CHUNK", "SKIN"];

    static readonly SKIN_GROUPS: readonly CheckGroup[] = ["FILE", "PACK", "MANIFEST", "LANG", "TEXTURE", "SKIN"];

    static readonly TEXTURE_GROUPS: readonly CheckGroup[] = [
        "FILE",
        "PACK",
        "MANIFEST",
        "LANG",
        "TEXTURE",
        "MODEL",
        "SOUND",
        "PARTICLE",
        "ENTITY",
        "BLOCK",
        "DEFINITION",
        "TEXTUREPACK",
    ];

    static readonly PERSONA_GROUPS: readonly CheckGroup[] = ["FILE", "PACK", "MANIFEST", "LANG", "PERSONA", "EMOTE"];

    static readonly MARKETPLACE_GROUPS: readonly CheckGroup[] = ["MARKETPLACE", "ART"];

    static readonly ALL_GROUPS: readonly CheckGroup[] = [
        ...ContentTypeGroups.WORLD_GROUPS,
        "TEXTUREPACK",
        "PERSONA",
        "EMOTE",
        "MARKETPLACE",
        "ART",
        "ADDON",
    ];

    static forContentType(contentType: ContentType, layout: Layout): readonly CheckGroup[] {
        const base = ContentTypeGroups.baseGroups(contentType);

        if (layout !== "marketplace") {
            return base;
        }

        return [...base, ...ContentTypeGroups.MARKETPLACE_GROUPS];
    }

    private static baseGroups(contentType: ContentType): readonly CheckGroup[] {
        switch (contentType) {
            case "addon":
                return ContentTypeGroups.ADDON_GROUPS;
            case "world":
                return ContentTypeGroups.WORLD_GROUPS;
            case "skin":
                return ContentTypeGroups.SKIN_GROUPS;
            case "texture":
                return ContentTypeGroups.TEXTURE_GROUPS;
            case "persona":
                return ContentTypeGroups.PERSONA_GROUPS;
        }
    }
}

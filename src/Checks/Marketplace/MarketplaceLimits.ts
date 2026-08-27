import ModelBuilder from "../../Model/ModelBuilder.js";

export default abstract class MarketplaceLimits {
    static readonly CONTENT_FOLDER = "Content";
    static readonly WORLD_TEMPLATE_FOLDER = "world_template";
    static readonly SKIN_PACK_FOLDER = "skin_pack";
    static readonly RESOURCE_PACKS_FOLDER = "resource_packs";
    static readonly BEHAVIOR_PACKS_FOLDER = "behavior_packs";
    static readonly PERSONA_FOLDER = "persona";
    static readonly BEHAVIOR_PACK_PREFIX = "BP_";
    static readonly RESOURCE_PACK_PREFIX = "RP_";
    static readonly ACRONYM_PATTERN = /^[A-Za-z0-9_-]+$/;
    static readonly MANIFEST_NAME = ModelBuilder.MANIFEST_NAME;
    static readonly WORLD_BEHAVIOR_PACKS_FILE = "world_behavior_packs.json";
    static readonly WORLD_RESOURCE_PACKS_FILE = "world_resource_packs.json";
    static readonly ADDON_PRODUCT_TYPE = "addon";
    static readonly PACKS_PER_FOLDER = 1;
    static readonly ARCHIVE_FOLDER = "__brarchive";
}

import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";

export default abstract class LangLimits {
    static readonly PRIMARY_LANGUAGE = LanguageCatalogReader.PRIMARY_LANGUAGE;
    static readonly CATALOG_PATH = LanguageCatalogReader.TEXTS_FOLDER + "/" + LanguageCatalogReader.LANGUAGES_FILE;
    static readonly PRIMARY_LANG_FILE = LanguageCatalogReader.PRIMARY_LANG_FILE;
    static readonly COMMENT_CHARACTER = "#";
    static readonly COMMENT_MARKER = "##";
    static readonly KEY_VALUE_SEPARATOR = "=";
    static readonly TOKEN_SEPARATOR = /[^a-z0-9]+/;
    static readonly ENTITY_KEY_PREFIX = "entity.";
    static readonly SPAWN_EGG_KEY_PREFIX = "item.spawn_egg.entity.";
    static readonly ITEM_KEY_PREFIX = "item.";
    static readonly BLOCK_KEY_PREFIX = "tile.";
    static readonly NAME_KEY_SUFFIX = ".name";
    static readonly DISPLAY_NAME_COMPONENT = "minecraft:display_name";
}

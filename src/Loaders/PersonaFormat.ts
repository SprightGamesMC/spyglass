import GeometryReader from "./GeometryReader.js";
import LanguageCatalogReader from "./LanguageCatalogReader.js";

export default abstract class PersonaFormat {
    static readonly META_SUFFIX = ".meta.json";
    static readonly GEOMETRY_SUFFIX = ".geometry.json";
    static readonly SHORT_GEOMETRY_SUFFIX = ".geo.json";
    static readonly ANIMATION_SUFFIX = ".animation.json";
    static readonly GEOMETRY_PREFIX = GeometryReader.LEGACY_KEY_PREFIX;
    static readonly LANG_PATH = LanguageCatalogReader.TEXTS_FOLDER + "/" + LanguageCatalogReader.PRIMARY_LANG_FILE;
    static readonly TEXTURE_SOURCES_KEY = "texture_sources";
    static readonly GEOMETRY_SOURCES_KEY = "geometry_sources";
    static readonly ANIMATION_SOURCES_KEY = "animation_sources";
    static readonly EMOTE_TYPE = "persona_emote";
    static readonly BODY_SIZES: readonly string[] = ["tall", "medium", "small", "smaller"];
    static readonly ARM_SIZES: readonly string[] = ["wide", "slim"];
    static readonly SIDES: readonly string[] = ["right", "left"];
    static readonly ZONES: readonly string[] = [
        "over_hair",
        "head_top",
        "head_front",
        "head_back",
        "head_left",
        "head_right",
        "body_front_upper",
        "body_front_lower",
        "body_back_upper",
        "body_back_lower",
        "right_arm_upper",
        "right_arm_middle",
        "right_arm_lower",
        "left_arm_upper",
        "left_arm_middle",
        "left_arm_lower",
        "right_leg_upper",
        "right_leg_middle",
        "right_leg_lower",
        "left_leg_upper",
        "left_leg_middle",
        "left_leg_lower",
        "right_leg",
        "right_leg_clothing",
        "left_leg",
        "left_leg_clothing",
    ];
}

import PersonaFormat from "../../Loaders/PersonaFormat.js";

export default abstract class PersonaLimits {
    static readonly MODULE_TYPE = "persona_piece";
    static readonly GEOMETRY_FORMAT_VERSION = "1.8.0";
    static readonly LANG_PATH = PersonaFormat.LANG_PATH;
    static readonly TEXTURE_SOURCES_KEY = PersonaFormat.TEXTURE_SOURCES_KEY;
    static readonly GEOMETRY_SOURCES_KEY = PersonaFormat.GEOMETRY_SOURCES_KEY;
    static readonly TITLE_PREFIX = "persona.";
    static readonly TITLE_SUFFIX = ".title";
    static readonly REQUIRED_META_FIELDS: readonly string[] = ["piece_id", "piece_name", "piece_type"];
    static readonly IDENTIFIER_PATTERN = /^[A-Za-z0-9_.-]+$/;
    static readonly IDENTIFIER_FORBIDDEN_ENDING = ".";
    static readonly HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
    static readonly TINT_FIELDS: readonly string[] = ["tint_base_color", "tint_color"];
    static readonly TINT_CHANNELS: readonly string[] = ["r_color", "g_color", "b_color", "a_color"];
    static readonly TEXTURE_EXTENSIONS: readonly string[] = ["png", "tga"];
    static readonly BODY_TEXTURE_WIDTH = 128;
    static readonly HEAD_TEXTURE_WIDTH = 32;
    static readonly FRAME_SIZES: readonly number[] = [32, 128];
    static readonly FRAME_LIMITS: Readonly<Record<number, number>> = { 32: 32, 128: 16 };
    static readonly BODY_SIZES: readonly string[] = PersonaFormat.BODY_SIZES;
    static readonly ARM_SIZES: readonly string[] = PersonaFormat.ARM_SIZES;
    static readonly SIDES: readonly string[] = PersonaFormat.SIDES;
    static readonly ZONES: readonly string[] = PersonaFormat.ZONES;
    static readonly SIZE_FIELDS: Readonly<Record<string, readonly string[]>> = {
        body_size: PersonaFormat.BODY_SIZES,
        arm_size: PersonaFormat.ARM_SIZES,
        side: PersonaFormat.SIDES,
    };
    static readonly PIECE_TYPES: readonly string[] = [
        "persona_top",
        "persona_bottom",
        "persona_high_pants",
        "persona_dress",
        "persona_outerwear",
        "persona_hood",
        "persona_head",
        "persona_hand",
        "persona_feet",
        "persona_face_accessory",
        "persona_back",
        "persona_arms",
        "persona_legs",
        "persona_skin",
        "persona_hair",
        "persona_eyes",
        "persona_mouth",
        "persona_facial_hair",
        "persona_capes",
        "persona_emote",
    ];
    static readonly NOT_SUBMITTABLE_PIECE_TYPES: readonly string[] = [
        "persona_skin",
        "persona_hair",
        "persona_eyes",
        "persona_mouth",
        "persona_facial_hair",
        "persona_capes",
    ];
    static readonly ARM_REPLACEMENT_TYPE = "persona_arms";
    static readonly LEG_REPLACEMENT_TYPE = "persona_legs";
    static readonly HAND_TYPE = "persona_hand";
    static readonly EMOTE_TYPE = PersonaFormat.EMOTE_TYPE;
}

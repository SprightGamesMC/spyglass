import PersonaFormat from "../../Loaders/PersonaFormat.js";

export default abstract class EmoteLimits {
    static readonly ANIMATION_SUFFIX = PersonaFormat.ANIMATION_SUFFIX;
    static readonly ANIMATION_SOURCES_KEY = PersonaFormat.ANIMATION_SOURCES_KEY;
    static readonly ANIMATION_NAME_PREFIX = "animation.";
    static readonly ANIMATION_FORMAT_VERSION = "1.8.0";
    static readonly IDENTIFIER_PREFIX = "em_";
    static readonly IDENTIFIER_PATTERN = /^[a-z0-9_]+$/;
    static readonly STUDIO_SEPARATOR = "_";
    static readonly LOOP_HOLD_VALUE = "hold_on_last_frame";
    static readonly ANIMATION_TIME_QUERIES: readonly string[] = ["query.anim_time", "q.anim_time"];
    static readonly TITLE_KEY = "persona.offer.title";
    static readonly CHAT_MESSAGE_KEY = "persona.emote.chat_message";
    static readonly EASTER_EGG_KEY = "persona.emote.easter_egg";
    static readonly PLAYER_TOKEN = "@";
    static readonly PLAYER_TOKEN_KEYS: readonly string[] = [EmoteLimits.CHAT_MESSAGE_KEY, EmoteLimits.EASTER_EGG_KEY];
    static readonly ROOT_BONE = "root";
    static readonly ALLOWED_BONES: readonly string[] = [
        "root",
        "hip",
        "body",
        "head",
        "rightArm",
        "leftArm",
        "rightLeg",
        "leftLeg",
        "rightItem",
        "leftItem",
    ];
    static readonly BONE_PARENTS: ReadonlyMap<string, string> = new Map([
        ["hip", "root"],
        ["body", "hip"],
        ["head", "body"],
        ["leftArm", "body"],
        ["leftItem", "leftArm"],
        ["rightArm", "body"],
        ["rightItem", "rightArm"],
        ["leftLeg", "root"],
        ["rightLeg", "root"],
    ]);
    static readonly CHAT_HIGHLIGHT_TOKEN = "&";
    static readonly CATMULLROM_LERP_MODE = "catmullrom";
    static readonly FRAMES_PER_SECOND = 24;
    static readonly FRAME_TIME_TOLERANCE = 0.0005;
    static readonly SAMPLE_TOLERANCE = 0.001;
    static readonly MAX_SAMPLED_SECONDS = 3600;
    static readonly MAX_LENGTH_SECONDS = 10;
    static readonly ROOT_Y_MIN = 0;
    static readonly ROOT_Y_MAX = 16;
    static readonly ROOT_HORIZONTAL_LIMIT = 4;
    static readonly SCALE_MIN = 0.85;
    static readonly SCALE_MAX = 1.15;
    static readonly NEUTRAL_ROTATION: readonly number[] = [0, 0, 0];
    static readonly NEUTRAL_POSITION: readonly number[] = [0, 0, 0];
    static readonly NEUTRAL_SCALE: readonly number[] = [1, 1, 1];
    static readonly PIECE_SOURCE_FIELDS: readonly string[] = [PersonaFormat.TEXTURE_SOURCES_KEY, PersonaFormat.GEOMETRY_SOURCES_KEY];
}

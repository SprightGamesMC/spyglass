import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import AnimationFileNameInvalid from "./AnimationFileNameInvalid.js";
import AnimationFileNotFound from "./AnimationFileNotFound.js";
import AnimationFormatVersionInvalid from "./AnimationFormatVersionInvalid.js";
import AnimationLengthNotOnFrame from "./AnimationLengthNotOnFrame.js";
import AnimationNameMismatch from "./AnimationNameMismatch.js";
import AnimationSourceMissing from "./AnimationSourceMissing.js";
import AnimationTimeQueryUsed from "./AnimationTimeQueryUsed.js";
import AnimationTooLong from "./AnimationTooLong.js";
import BoneNotAllowed from "./BoneNotAllowed.js";
import BoneScaleOverLimit from "./BoneScaleOverLimit.js";
import ChannelValueNotNumeric from "./ChannelValueNotNumeric.js";
import ChatHighlightInvalid from "./ChatHighlightInvalid.js";
import ChatMessageMissing from "./ChatMessageMissing.js";
import ChatMessageNoPlayerToken from "./ChatMessageNoPlayerToken.js";
import EasterEggMissing from "./EasterEggMissing.js";
import EdgeKeyframeMissing from "./EdgeKeyframeMissing.js";
import EndPoseNotNeutral from "./EndPoseNotNeutral.js";
import HoldOnLastFrameUsed from "./HoldOnLastFrameUsed.js";
import IdentifierInvalid from "./IdentifierInvalid.js";
import KeyframeNotOnFrame from "./KeyframeNotOnFrame.js";
import LimitedChannelValueNotNumeric from "./LimitedChannelValueNotNumeric.js";
import LoopEnabled from "./LoopEnabled.js";
import MultipleAnimations from "./MultipleAnimations.js";
import PieceSourcesPresent from "./PieceSourcesPresent.js";
import RootLandingOffset from "./RootLandingOffset.js";
import RootMovementOverLimit from "./RootMovementOverLimit.js";
import ScaledChildOfScaledParent from "./ScaledChildOfScaledParent.js";
import StartPoseNotNeutral from "./StartPoseNotNeutral.js";
import TitleMissing from "./TitleMissing.js";

export default abstract class EmoteChecks {
    static readonly GROUP: CheckGroup = "EMOTE";
    static readonly ANIMATION_SOURCE_MISSING = 101;
    static readonly CHAT_MESSAGE_MISSING = 102;
    static readonly EASTER_EGG_MISSING = 103;
    static readonly TITLE_MISSING = 104;
    static readonly EDGE_KEYFRAME_MISSING = 105;
    static readonly ANIMATION_FILE_NAME_INVALID = 201;
    static readonly IDENTIFIER_INVALID = 202;
    static readonly ANIMATION_NAME_MISMATCH = 203;
    static readonly BONE_NOT_ALLOWED = 204;
    static readonly HOLD_ON_LAST_FRAME_USED = 205;
    static readonly ANIMATION_TIME_QUERY_USED = 206;
    static readonly START_POSE_NOT_NEUTRAL = 207;
    static readonly END_POSE_NOT_NEUTRAL = 208;
    static readonly PIECE_SOURCES_PRESENT = 209;
    static readonly CHAT_MESSAGE_NO_PLAYER_TOKEN = 210;
    static readonly LIMITED_CHANNEL_VALUE_NOT_NUMERIC = 211;
    static readonly CHANNEL_VALUE_NOT_NUMERIC = 212;
    static readonly CHAT_HIGHLIGHT_INVALID = 213;
    static readonly KEYFRAME_NOT_ON_FRAME = 214;
    static readonly ANIMATION_LENGTH_NOT_ON_FRAME = 215;
    static readonly ANIMATION_FILE_NOT_FOUND = 301;
    static readonly ANIMATION_TOO_LONG = 401;
    static readonly ROOT_MOVEMENT_OVER_LIMIT = 402;
    static readonly BONE_SCALE_OVER_LIMIT = 403;
    static readonly ROOT_LANDING_OFFSET = 404;
    static readonly ANIMATION_FORMAT_VERSION_INVALID = 501;
    static readonly MULTIPLE_ANIMATIONS = 601;
    static readonly LOOP_ENABLED = 701;
    static readonly SCALED_CHILD_OF_SCALED_PARENT = 702;

    static create(): Check[] {
        return [
            new AnimationSourceMissing(),
            new ChatMessageMissing(),
            new EasterEggMissing(),
            new TitleMissing(),
            new EdgeKeyframeMissing(),
            new AnimationFileNameInvalid(),
            new IdentifierInvalid(),
            new AnimationNameMismatch(),
            new BoneNotAllowed(),
            new HoldOnLastFrameUsed(),
            new AnimationTimeQueryUsed(),
            new StartPoseNotNeutral(),
            new EndPoseNotNeutral(),
            new PieceSourcesPresent(),
            new ChatMessageNoPlayerToken(),
            new LimitedChannelValueNotNumeric(),
            new ChannelValueNotNumeric(),
            new ChatHighlightInvalid(),
            new KeyframeNotOnFrame(),
            new AnimationLengthNotOnFrame(),
            new AnimationFileNotFound(),
            new AnimationTooLong(),
            new RootMovementOverLimit(),
            new BoneScaleOverLimit(),
            new RootLandingOffset(),
            new AnimationFormatVersionInvalid(),
            new MultipleAnimations(),
            new LoopEnabled(),
            new ScaledChildOfScaledParent(),
        ];
    }
}

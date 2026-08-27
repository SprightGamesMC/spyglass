import type { CheckDefinition } from "../../Types/CheckTypes.js";
import EmoteChecks from "./EmoteChecks.js";
import PoseNotNeutralCheck from "./PoseNotNeutralCheck.js";

export default class StartPoseNotNeutral extends PoseNotNeutralCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.START_POSE_NOT_NEUTRAL,
        slug: "start-pose-not-neutral",
        severity: "error",
        description: "First keyframe has rotation, position, or scale away from neutral",
    };

    protected readonly edge = "start" as const;
}

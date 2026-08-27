import type { CheckDefinition } from "../../Types/CheckTypes.js";
import EmoteChecks from "./EmoteChecks.js";
import PoseNotNeutralCheck from "./PoseNotNeutralCheck.js";

export default class EndPoseNotNeutral extends PoseNotNeutralCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.END_POSE_NOT_NEUTRAL,
        slug: "end-pose-not-neutral",
        severity: "error",
        description: "Last keyframe has rotation, position, or scale away from neutral",
    };

    protected readonly edge = "end" as const;
}

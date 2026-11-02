import type { CheckDefinition } from "../../Types/CheckTypes.js";
import EmoteChecks from "./EmoteChecks.js";
import NonNumericChannelCheck from "./NonNumericChannelCheck.js";

export default class LimitedChannelValueNotNumeric extends NonNumericChannelCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.LIMITED_CHANNEL_VALUE_NOT_NUMERIC,
        slug: "limited-channel-value-not-numeric",
        severity: "error",
        description: "Root position or bone scale has a component that is not a number",
    };

    protected readonly coversLimitedChannels = true;
}

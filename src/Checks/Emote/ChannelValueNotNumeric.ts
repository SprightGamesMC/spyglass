import type { CheckDefinition } from "../../Types/CheckTypes.js";
import EmoteChecks from "./EmoteChecks.js";
import NonNumericChannelCheck from "./NonNumericChannelCheck.js";

export default class ChannelValueNotNumeric extends NonNumericChannelCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.CHANNEL_VALUE_NOT_NUMERIC,
        slug: "channel-value-not-numeric",
        severity: "warning",
        description: "Rotation or non root position has a component that is not a number",
    };

    protected readonly coversLimitedChannels = false;
}

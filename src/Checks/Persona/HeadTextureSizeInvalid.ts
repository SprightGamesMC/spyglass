import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PersonaTextureSizeCheck from "./PersonaTextureSizeCheck.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class HeadTextureSizeInvalid extends PersonaTextureSizeCheck {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.HEAD_TEXTURE_SIZE_INVALID,
        slug: "head-texture-size-invalid",
        severity: "error",
        description: "Head texture width is not 32",
    };

    protected readonly head = true;
    protected readonly expectedWidth = PersonaLimits.HEAD_TEXTURE_WIDTH;
    protected readonly label = "Head";
}

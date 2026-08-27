import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PersonaTextureSizeCheck from "./PersonaTextureSizeCheck.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class BodyTextureSizeInvalid extends PersonaTextureSizeCheck {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.BODY_TEXTURE_SIZE_INVALID,
        slug: "body-texture-size-invalid",
        severity: "error",
        description: "Body texture width is not 128",
    };

    protected readonly head = false;
    protected readonly expectedWidth = PersonaLimits.BODY_TEXTURE_WIDTH;
    protected readonly label = "Body";
}

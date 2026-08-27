import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import IdentifierNotNamespaced from "./IdentifierNotNamespaced.js";

export default abstract class ParticleChecks {
    static readonly GROUP: CheckGroup = "PARTICLE";
    static readonly IDENTIFIER_NOT_NAMESPACED = 201;

    static create(): Check[] {
        return [new IdentifierNotNamespaced()];
    }
}

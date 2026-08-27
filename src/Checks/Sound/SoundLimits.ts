import type { ItemKind } from "../../Types/ModelTypes.js";

export default abstract class SoundLimits {
    static readonly KINDS: readonly ItemKind[] = ["sound_definitions"];
}

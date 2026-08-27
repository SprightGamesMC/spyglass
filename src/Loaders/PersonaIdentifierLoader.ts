import type { CheckContext } from "../Types/CheckTypes.js";
import type { PersonaPieceIdentity } from "../Types/PersonaTypes.js";
import PackItemLoader from "./PackItemLoader.js";
import PersonaLoader from "./PersonaLoader.js";

export default abstract class PersonaIdentifierLoader {
    private static readonly CACHE_KEY = "persona-identifier";

    static load(context: CheckContext): Promise<PersonaPieceIdentity | undefined> {
        return context.loaders.cached(PersonaIdentifierLoader.CACHE_KEY, () => PersonaIdentifierLoader.collect(context));
    }

    private static async collect(context: CheckContext): Promise<PersonaPieceIdentity | undefined> {
        for (const data of await PersonaLoader.packs(context)) {
            if (data.pack.type !== PackItemLoader.PERSONA_PACK_TYPE || data.meta === undefined) {
                continue;
            }

            return {
                pieceName: PersonaIdentifierLoader.nonEmpty(PersonaLoader.string(data.meta, "piece_name")),
                pieceType: PersonaIdentifierLoader.nonEmpty(PersonaLoader.string(data.meta, "piece_type")),
            };
        }

        return undefined;
    }

    private static nonEmpty(value: string | undefined): string | undefined {
        return value === "" ? undefined : value;
    }
}

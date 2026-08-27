import type Check from "./Check.js";
import type { CheckDefinition } from "../Types/CheckTypes.js";
import AddonChecks from "./Addon/AddonChecks.js";
import ArtChecks from "./Art/ArtChecks.js";
import BlockChecks from "./Block/BlockChecks.js";
import CheckIds from "./CheckIds.js";
import ChunkChecks from "./Chunk/ChunkChecks.js";
import DefinitionChecks from "./Definition/DefinitionChecks.js";
import EmoteChecks from "./Emote/EmoteChecks.js";
import EntityChecks from "./Entity/EntityChecks.js";
import FileChecks from "./File/FileChecks.js";
import LangChecks from "./Lang/LangChecks.js";
import ManifestChecks from "./Manifest/ManifestChecks.js";
import MarketplaceChecks from "./Marketplace/MarketplaceChecks.js";
import ModelChecks from "./Model/ModelChecks.js";
import PackChecks from "./Pack/PackChecks.js";
import ParticleChecks from "./Particle/ParticleChecks.js";
import PersonaChecks from "./Persona/PersonaChecks.js";
import ScriptChecks from "./Script/ScriptChecks.js";
import SkinChecks from "./Skin/SkinChecks.js";
import SoundChecks from "./Sound/SoundChecks.js";
import TextureChecks from "./Texture/TextureChecks.js";
import TexturePackChecks from "./TexturePack/TexturePackChecks.js";
import WorldChecks from "./World/WorldChecks.js";

export default abstract class CheckRegistry {
    private static readonly INSTANCES: readonly Check[] = CheckRegistry.build();

    static all(): readonly Check[] {
        return CheckRegistry.INSTANCES;
    }

    static definitions(): readonly CheckDefinition[] {
        return CheckRegistry.all().map((check) => check.definition);
    }

    private static build(): readonly Check[] {
        const checks = [
            ...FileChecks.create(),
            ...PackChecks.create(),
            ...ManifestChecks.create(),
            ...LangChecks.create(),
            ...TextureChecks.create(),
            ...ModelChecks.create(),
            ...SoundChecks.create(),
            ...ParticleChecks.create(),
            ...ScriptChecks.create(),
            ...EntityChecks.create(),
            ...BlockChecks.create(),
            ...DefinitionChecks.create(),
            ...WorldChecks.create(),
            ...ChunkChecks.create(),
            ...TexturePackChecks.create(),
            ...SkinChecks.create(),
            ...PersonaChecks.create(),
            ...EmoteChecks.create(),
            ...MarketplaceChecks.create(),
            ...ArtChecks.create(),
            ...AddonChecks.create(),
        ].sort((left, right) => CheckIds.compare(left.id, right.id));

        CheckRegistry.assertUniqueIds(checks);

        return checks;
    }

    private static assertUniqueIds(checks: readonly Check[]): void {
        const seen = new Set<string>();

        for (const check of checks) {
            if (seen.has(check.id)) {
                throw new Error("Duplicate check id " + check.id);
            }

            seen.add(check.id);
        }
    }
}

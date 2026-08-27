import type Check from "../../../src/Checks/Check.js";
import type { ContentType, Finding } from "../../../src/Types/CheckTypes.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { EmoteAnimationOptions, EmoteOptions, PersonaPieceOptions } from "../../Types/Core/PersonaFixtureTypes.js";
import LangLimits from "../../../src/Checks/Lang/LangLimits.js";
import PersonaFormat from "../../../src/Loaders/PersonaFormat.js";
import ImageBytes from "./ImageBytes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class PersonaFixture {
    static readonly ROOT = "PP";
    static readonly MANIFEST_PATH = PersonaFixture.ROOT + "/manifest.json";
    static readonly LANG_PATH = PersonaFixture.ROOT + "/" + PersonaFormat.LANG_PATH;
    static readonly BODY_TEXTURE = "spright_hat.png";
    static readonly HEAD_TEXTURE = "spright_hat_head.png";
    static readonly GEOMETRY_TEXTURE = "spright_hat_geo.png";
    static readonly EMOTE_ID = "em_spright_wave";
    static readonly EMOTE_ANIMATION = "animation.em_spright_wave";
    static readonly BODY_SIZES: readonly string[] = PersonaFormat.BODY_SIZES;
    private static readonly LANGUAGES_PATH = PersonaFixture.ROOT + "/" + LangLimits.CATALOG_PATH;
    private static readonly PIECE_ID = "spright_hat";
    private static readonly PIECE_GUID = "3f6c1a2b-4d5e-4f60-8a71-92b3c4d5e6f7";
    private static readonly PIECE_LANG = "persona.spright_hat.title=Spright Hat\n";
    private static readonly EMOTE_LANG =
        "persona.offer.title=Wave\n" + "persona.emote.chat_message=@ waves at everyone\n" + "persona.emote.easter_egg=@ waves twice\n";

    static path(name: string): string {
        return PersonaFixture.ROOT + "/" + name;
    }

    static metaPath(name: string = PersonaFixture.PIECE_ID): string {
        return PersonaFixture.path(name + PersonaFormat.META_SUFFIX);
    }

    static geometryPath(): string {
        return PersonaFixture.path(PersonaFixture.PIECE_ID + PersonaFormat.GEOMETRY_SUFFIX);
    }

    static animationPath(): string {
        return PersonaFixture.path(PersonaFixture.EMOTE_ID + PersonaFormat.ANIMATION_SUFFIX);
    }

    static geometryIdentifiers(name: string = PersonaFixture.PIECE_ID): string[] {
        return PersonaFixture.BODY_SIZES.map((size) => "geometry." + name + "." + size);
    }

    static pieceMeta(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            piece_id: PersonaFixture.PIECE_GUID,
            piece_name: PersonaFixture.PIECE_ID,
            piece_type: "persona_head",
            texture_sources: [{ texture: PersonaFixture.BODY_TEXTURE }, { texture: PersonaFixture.HEAD_TEXTURE, use_face_uv: true }],
            geometry_sources: PersonaFixture.BODY_SIZES.map((size) => ({
                geometry: "geometry." + PersonaFixture.PIECE_ID + "." + size,
                body_size: size,
                texture: PersonaFixture.GEOMETRY_TEXTURE,
            })),
            ...overrides,
        };
    }

    static pieceGeometry(
        identifiers: readonly string[] = PersonaFixture.geometryIdentifiers(),
        cubeZone?: string
    ): Record<string, unknown> {
        const geometry: Record<string, unknown> = { format_version: "1.8.0" };

        for (const identifier of identifiers) {
            const cube: Record<string, unknown> = { origin: [0, 24, 0], size: [8, 4, 8], uv: [0, 0] };

            if (cubeZone !== undefined) {
                cube.zone = cubeZone;
            }

            geometry[identifier] = { bones: [{ name: "hat", pivot: [0, 24, 0], cubes: [cube] }] };
        }

        return geometry;
    }

    static defaultTextures(): Record<string, Uint8Array> {
        return {
            [PersonaFixture.BODY_TEXTURE]: ImageBytes.png({ width: 128, height: 128 }),
            [PersonaFixture.HEAD_TEXTURE]: ImageBytes.png({ width: 32, height: 32 }),
            [PersonaFixture.GEOMETRY_TEXTURE]: ImageBytes.png({ width: 64, height: 64 }),
        };
    }

    static pieceFiles(options: PersonaPieceOptions = {}): FixtureFiles {
        const files: Record<string, Uint8Array | string | object> = {
            [PersonaFixture.MANIFEST_PATH]: options.manifest ?? ModelFixture.personaManifest(),
        };
        const metaName = options.metaName ?? PersonaFixture.PIECE_ID;

        files[PersonaFixture.metaPath(metaName)] = options.meta ?? PersonaFixture.pieceMeta(options.metaOverrides);

        if (options.geometry !== null) {
            files[PersonaFixture.geometryPath()] = options.geometry ?? PersonaFixture.pieceGeometry();
        }

        for (const [name, bytes] of Object.entries(options.textures ?? PersonaFixture.defaultTextures())) {
            files[PersonaFixture.path(name)] = bytes;
        }

        PersonaFixture.addTexts(files, options.lang, PersonaFixture.PIECE_LANG);

        return { ...files, ...options.extra };
    }

    static emoteAnimation(options: EmoteAnimationOptions = {}): Record<string, unknown> {
        const animation: Record<string, unknown> = {
            animation_length: options.length ?? 2,
            bones: options.bones ?? {
                rightArm: { rotation: { "0.0": [0, 0, 0], "1.0": [0, 0, 90], "2.0": [0, 0, 0] } },
                root: { position: { "0.0": [0, 0, 0], "1.0": [0, 8, 0], "2.0": [0, 0, 0] } },
            },
        };

        if (options.loop !== undefined) {
            animation.loop = options.loop;
        }

        return {
            format_version: options.formatVersion ?? "1.8.0",
            animations: { [options.name ?? PersonaFixture.EMOTE_ANIMATION]: animation, ...options.extraAnimations },
        };
    }

    static emoteFiles(options: EmoteOptions = {}): FixtureFiles {
        const files: Record<string, Uint8Array | string | object> = {
            [PersonaFixture.MANIFEST_PATH]: options.manifest ?? ModelFixture.personaManifest(),
        };
        const metaName = options.metaName ?? PersonaFixture.EMOTE_ID;

        files[PersonaFixture.metaPath(metaName)] = options.meta ?? PersonaFixture.emoteMeta(options.metaOverrides);

        if (options.animation !== null) {
            files[PersonaFixture.animationPath()] = options.animation ?? PersonaFixture.emoteAnimation();
        }

        PersonaFixture.addTexts(files, options.lang, PersonaFixture.EMOTE_LANG);

        return { ...files, ...options.extra };
    }

    static run(check: Check, files: FixtureFiles, contentType: ContentType): Promise<Finding[]> {
        return ModelFixture.findings(check, files, { contentType });
    }

    static summary(check: Check, files: FixtureFiles, contentType: ContentType): Promise<FindingSummary> {
        return ModelFixture.summary(check, files, { contentType });
    }

    static without(files: FixtureFiles, ...paths: readonly string[]): FixtureFiles {
        const copy: Record<string, Uint8Array | string | object> = { ...files };

        for (const path of paths) {
            delete copy[path];
        }

        return copy;
    }

    static repeat(id: string, count: number): string[] {
        return Array.from({ length: count }, () => id);
    }

    private static addTexts(
        files: Record<string, Uint8Array | string | object>,
        lang: string | null | undefined,
        defaultLang: string
    ): void {
        if (lang !== null) {
            files[PersonaFixture.LANG_PATH] = lang ?? defaultLang;
        }

        files[PersonaFixture.LANGUAGES_PATH] = ["en_US"];
    }

    private static emoteMeta(overrides: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            piece_id: PersonaFixture.PIECE_GUID,
            piece_name: PersonaFixture.EMOTE_ID,
            piece_type: "persona_emote",
            animation_sources: [
                { name: PersonaFixture.EMOTE_ANIMATION, animationFile: PersonaFixture.EMOTE_ID + PersonaFormat.ANIMATION_SUFFIX },
            ],
            ...overrides,
        };
    }
}

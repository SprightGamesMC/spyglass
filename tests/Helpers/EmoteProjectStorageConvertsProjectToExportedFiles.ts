import type Check from "../../src/Checks/Check.js";
import type {
    EmoteProjectStorageConvertsProjectToExportedFilesFindings,
    EmoteProjectStorageConvertsProjectToExportedFilesResult,
} from "../Types/EmoteProjectStorageConvertsProjectToExportedFilesTypes.js";
import AnimationTooLong from "../../src/Checks/Emote/AnimationTooLong.js";
import BoneNotAllowed from "../../src/Checks/Emote/BoneNotAllowed.js";
import ChatHighlightInvalid from "../../src/Checks/Emote/ChatHighlightInvalid.js";
import IdentifierInvalid from "../../src/Checks/Emote/IdentifierInvalid.js";
import LimitedChannelValueNotNumeric from "../../src/Checks/Emote/LimitedChannelValueNotNumeric.js";
import LoopEnabled from "../../src/Checks/Emote/LoopEnabled.js";
import RootMovementOverLimit from "../../src/Checks/Emote/RootMovementOverLimit.js";
import Loaders from "../../src/Loaders/Loaders.js";
import ModelBuilder from "../../src/Model/ModelBuilder.js";
import EmoteProjectStorage from "../../src/Storage/EmoteProjectStorage.js";

export default abstract class EmoteProjectStorageConvertsProjectToExportedFiles {
    static readonly FILE_NAME = "em_spright_wave.bbmodel";
    static readonly ANIMATION_KEY = "animation.em_spright_wave";
    static readonly CHECKS: Readonly<Record<string, Check>> = {
        length: new AnimationTooLong(),
        bone: new BoneNotAllowed(),
        highlight: new ChatHighlightInvalid(),
        identifier: new IdentifierInvalid(),
        numeric: new LimitedChannelValueNotNumeric(),
        loop: new LoopEnabled(),
        root: new RootMovementOverLimit(),
    };

    static project(overrides: Record<string, unknown> = {}, animationOverrides: Record<string, unknown> = {}): string {
        return JSON.stringify({
            meta: { format_version: "5.0", model_format: "bedrock_emote" },
            model_identifier: "spright_wave",
            persona_emote_display_name: "Wave",
            persona_emote_chat_message: "@ does the &Wave&",
            persona_emote_chat_easter_egg: "@ does the &Big Wave&",
            animations: [
                {
                    name: "animation.emote",
                    loop: "once",
                    length: 2,
                    animators: {
                        first: {
                            name: "root",
                            type: "bone",
                            keyframes: [
                                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 2, ["0", "0", "0"]),
                                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 0, ["0", "0", "0"]),
                            ],
                        },
                    },
                    ...animationOverrides,
                },
            ],
            ...overrides,
        });
    }

    static keyframe(channel: string, time: number, value: readonly unknown[], interpolation: string = "linear"): Record<string, unknown> {
        return { channel, time, interpolation, data_points: [{ x: value[0], y: value[1], z: value[2] }] };
    }

    static animators(name: string, keyframes: readonly unknown[]): Record<string, unknown> {
        return { animators: { first: { name, type: "bone", keyframes } } };
    }

    static async convert(text: string): Promise<EmoteProjectStorageConvertsProjectToExportedFilesResult> {
        const storage = new EmoteProjectStorage(text, EmoteProjectStorageConvertsProjectToExportedFiles.FILE_NAME);
        const read = async (path: string): Promise<string> => new TextDecoder().decode(await storage.readBytes(path));

        return {
            paths: storage.listFiles().map((entry) => entry.path),
            meta: JSON.parse(await read("em_spright_wave.meta.json")) as Record<string, unknown>,
            animation: JSON.parse(await read("em_spright_wave.animation.json")) as Record<string, unknown>,
            lang: await read("texts/en_US.lang"),
        };
    }

    static async bones(text: string): Promise<Record<string, unknown>> {
        const { animation } = await EmoteProjectStorageConvertsProjectToExportedFiles.convert(text);
        const animations = animation.animations as Record<string, Record<string, unknown>>;

        return animations[EmoteProjectStorageConvertsProjectToExportedFiles.ANIMATION_KEY].bones as Record<string, unknown>;
    }

    static async findings(check: string, text: string): Promise<EmoteProjectStorageConvertsProjectToExportedFilesFindings> {
        const storage = new EmoteProjectStorage(text, EmoteProjectStorageConvertsProjectToExportedFiles.FILE_NAME);
        const loaders = new Loaders(storage, { currentGameVersion: "10.30.20", betaModuleVersions: {} });
        const model = await new ModelBuilder(storage, "standard", loaders.json).build();

        return EmoteProjectStorageConvertsProjectToExportedFiles.CHECKS[check].run({ model, loaders, contentType: "persona" });
    }

    static create(text: string): EmoteProjectStorage {
        return new EmoteProjectStorage(text, EmoteProjectStorageConvertsProjectToExportedFiles.FILE_NAME);
    }
}

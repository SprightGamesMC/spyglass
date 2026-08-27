import type { CheckContext } from "../Types/CheckTypes.js";
import type { CommandSource } from "../Types/CommandTypes.js";
import type { ContentItem, ItemKind, Pack } from "../Types/ModelTypes.js";
import MinecraftCommands from "../Data/MinecraftCommands.js";
import JsonLoader from "./JsonLoader.js";

export default abstract class CommandSourceLoader {
    private static readonly ANIMATION_KINDS: readonly ItemKind[] = ["animation_behavior", "animation_controller_behavior"];
    private static readonly CACHE_KEY = "command-sources";

    static load(context: CheckContext): Promise<CommandSource[]> {
        return context.loaders.cached(CommandSourceLoader.CACHE_KEY, () => CommandSourceLoader.collect(context));
    }

    private static async collect(context: CheckContext): Promise<CommandSource[]> {
        const sources: CommandSource[] = [];

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                sources.push(...(await CommandSourceLoader.collectItem(context, pack, item)));
            }
        }

        return sources;
    }

    private static async collectItem(context: CheckContext, pack: Pack, item: ContentItem): Promise<CommandSource[]> {
        if (item.kind === "function") {
            return CommandSourceLoader.collectFunction(context, pack, item);
        }

        if (item.kind === "dialogue" || CommandSourceLoader.ANIMATION_KINDS.includes(item.kind)) {
            return CommandSourceLoader.collectJson(context, pack, item);
        }

        return [];
    }

    private static async collectFunction(context: CheckContext, pack: Pack, item: ContentItem): Promise<CommandSource[]> {
        const lines = await context.loaders.text.readLines(item.path);

        if (lines === undefined) {
            return [];
        }

        const sources: CommandSource[] = [];

        lines.forEach((line, index) => {
            const source = CommandSourceLoader.toSource(line, item.path, pack.root, index + 1);

            if (source !== undefined) {
                sources.push(source);
            }
        });

        return sources;
    }

    private static async collectJson(context: CheckContext, pack: Pack, item: ContentItem): Promise<CommandSource[]> {
        const value = await context.loaders.json.readValue(item.path);

        return JsonLoader.collectStrings(value, (text) => text.startsWith("/"))
            .map((match) => CommandSourceLoader.toSource(match.value, item.path, pack.root, undefined))
            .filter((source): source is CommandSource => source !== undefined);
    }

    private static toSource(text: string, path: string, pack: string, line: number | undefined): CommandSource | undefined {
        const name = MinecraftCommands.commandName(text);

        if (name === undefined) {
            return undefined;
        }

        return { path, pack, line, command: text.trim(), name, leadingSlash: text.trim().startsWith("/") };
    }
}

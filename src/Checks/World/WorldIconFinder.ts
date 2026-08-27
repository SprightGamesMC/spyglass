import type { ContentItem, ContentModel, World } from "../../Types/ModelTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import WorldLimits from "./WorldLimits.js";

export default abstract class WorldIconFinder {
    static find(world: World): ContentItem[] {
        return world.items.filter((item) => WorldIconFinder.isIcon(item.path));
    }

    static hasEducationItem(model: ContentModel): boolean {
        const packItems = model.packs.flatMap((pack) => pack.items);
        const worldItems = model.worlds.flatMap((world) => world.items);

        return [...packItems, ...worldItems].some((item) => item.kind === "education");
    }

    private static isIcon(path: string): boolean {
        const name = PathUtilities.fileName(path).toLowerCase();

        return name.includes(WorldLimits.ICON_NAME_PART) && PathUtilities.extension(name) === WorldLimits.ICON_EXTENSION;
    }
}

import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind, PackType } from "../../Types/ModelTypes.js";
import JsonKeys from "../../Data/JsonKeys.js";
import FormatVersionReader from "../../Loaders/FormatVersionReader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";

export default abstract class FormatVersionComparisonCheck extends Check {
    protected abstract readonly kinds: readonly ItemKind[];
    protected readonly packType?: PackType;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, this.kinds, this.packType)) {
            const result = await FormatVersionReader.read(context, item.path);

            if (result.status !== "ok" || result.version === undefined) {
                continue;
            }

            const expected = this.expectedVersion(context, item);

            if (!this.violates(result.version, expected, this.comparesExactly(item))) {
                continue;
            }

            const message = this.describe(VersionUtilities.format(result.version), VersionUtilities.format(expected));

            findings.push(this.finding(message, item.path, pack.root, { field: JsonKeys.FORMAT_VERSION }));
        }

        return findings;
    }

    protected abstract violates(version: GameVersion, expected: GameVersion, exactly: boolean): boolean;

    protected abstract describe(actual: string, expected: string): string;

    protected expectedVersion(context: CheckContext, _item: ContentItem): GameVersion {
        return context.loaders.currentGameVersion;
    }

    protected comparesExactly(_item: ContentItem): boolean {
        return false;
    }
}

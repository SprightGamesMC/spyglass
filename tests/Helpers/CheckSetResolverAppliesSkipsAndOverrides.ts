import type { ContentType, Layout, ResolvedCheck } from "../../src/Types/CheckTypes.js";
import type { ConfigFile, SeverityOverride, SkipSelector } from "../../src/Types/CliTypes.js";
import type { ResolverFixture } from "../Types/CheckSetResolverAppliesSkipsAndOverridesTypes.js";
import CheckIds from "../../src/Checks/CheckIds.js";
import CheckSetResolver from "../../src/Cli/CheckSetResolver.js";
import ConfigLoader from "../../src/Cli/ConfigLoader.js";

export default abstract class CheckSetResolverAppliesSkipsAndOverrides {
    static readonly FIXTURE: ResolverFixture = {
        definitions: [
            { group: "FILE", number: 201, slug: "json-invalid", severity: "error", description: "a" },
            { group: "FILE", number: 401, slug: "path-too-long", severity: "error", description: "b" },
            {
                group: "MANIFEST",
                number: 105,
                slug: "pack-icon-missing",
                severity: "error",
                description: "c",
                excludedContentTypes: ["skin"],
            },
            { group: "SKIN", number: 101, slug: "skins-json-missing", severity: "error", description: "d" },
            { group: "ADDON", number: 101, slug: "behavior-pack-missing", severity: "error", description: "e" },
            { group: "ART", number: 108, slug: "approval-sheet-missing", severity: "error", description: "f", contentTypes: ["persona"] },
        ],
    };

    static resolve(
        contentType: ContentType | undefined,
        layout: Layout,
        config: ConfigFile,
        skips: readonly SkipSelector[],
        severities: readonly SeverityOverride[]
    ): ResolvedCheck[] {
        return CheckSetResolver.resolve(
            CheckSetResolverAppliesSkipsAndOverrides.FIXTURE.definitions,
            contentType,
            layout,
            config,
            skips,
            severities
        );
    }

    static resolveWithoutConfig(contentType: ContentType | undefined, layout: Layout): ResolvedCheck[] {
        return CheckSetResolverAppliesSkipsAndOverrides.resolve(contentType, layout, ConfigLoader.EMPTY, [], []);
    }

    static find(resolved: readonly ResolvedCheck[], id: string): ResolvedCheck {
        const found = resolved.find((entry) => CheckIds.of(entry.definition) === id);

        if (found === undefined) {
            throw new Error("Missing " + id);
        }

        return found;
    }

    static resolveThrows(skips: readonly SkipSelector[], severities: readonly SeverityOverride[]): boolean {
        try {
            CheckSetResolverAppliesSkipsAndOverrides.resolve("addon", "standard", ConfigLoader.EMPTY, skips, severities);

            return false;
        } catch {
            return true;
        }
    }
}

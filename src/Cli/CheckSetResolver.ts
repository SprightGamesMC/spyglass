import type { CheckDefinition, ContentType, Layout, ResolvedCheck, Severity } from "../Types/CheckTypes.js";
import type { ConfigFile, EffectiveSeverity, SeverityOverride, SkipSelector } from "../Types/CliTypes.js";
import CheckIds from "../Checks/CheckIds.js";
import ContentTypeGroups from "../Checks/ContentTypeGroups.js";
import UsageError from "../Errors/UsageError.js";

export default abstract class CheckSetResolver {
    static resolve(
        definitions: readonly CheckDefinition[],
        contentType: ContentType | undefined,
        layout: Layout,
        config: ConfigFile,
        commandLineSkips: readonly SkipSelector[],
        commandLineSeverities: readonly SeverityOverride[]
    ): ResolvedCheck[] {
        for (const skip of [...config.skips.map((entry) => entry.selector), ...commandLineSkips]) {
            CheckSetResolver.assertKnown(definitions, skip);
        }

        for (const override of [...config.severityOverrides, ...commandLineSeverities]) {
            CheckSetResolver.assertKnownTarget(definitions, override.target);
        }

        const groups = contentType === undefined ? ContentTypeGroups.ALL_GROUPS : ContentTypeGroups.forContentType(contentType, layout);

        return definitions.map((definition) =>
            CheckSetResolver.resolveOne(definition, contentType, groups, config, commandLineSkips, commandLineSeverities)
        );
    }

    private static matches(selector: SkipSelector, id: string): boolean {
        const number = CheckIds.numberOf(id);

        if (CheckIds.groupOf(id) !== selector.group || number === undefined) {
            return false;
        }

        if (selector.numbers !== undefined) {
            return selector.numbers.includes(number);
        }

        if (selector.from !== undefined && selector.to !== undefined) {
            return number >= selector.from && number <= selector.to;
        }

        return true;
    }

    private static resolveOne(
        definition: CheckDefinition,
        contentType: ContentType | undefined,
        groups: readonly string[],
        config: ConfigFile,
        commandLineSkips: readonly SkipSelector[],
        commandLineSeverities: readonly SeverityOverride[]
    ): ResolvedCheck {
        const severity = CheckSetResolver.effectiveSeverity(definition, config.severityOverrides, commandLineSeverities);

        if (!groups.includes(definition.group)) {
            return CheckSetResolver.skip(definition, severity, "group not selected for content type");
        }

        if (contentType !== undefined && !CheckSetResolver.appliesToContentType(definition, contentType)) {
            return CheckSetResolver.skip(definition, severity, "check does not apply to " + contentType);
        }

        const configSkip = config.skips.find((entry) => CheckSetResolver.matches(entry.selector, CheckIds.of(definition)));

        if (configSkip !== undefined) {
            const reason = configSkip.reason === undefined ? "skipped by config" : "skipped by config: " + configSkip.reason;

            return CheckSetResolver.skip(definition, severity, reason);
        }

        if (commandLineSkips.some((selector) => CheckSetResolver.matches(selector, CheckIds.of(definition)))) {
            return CheckSetResolver.skip(definition, severity, "skipped by --skip");
        }

        return { definition, severity: severity.value, skipped: false, overrideSource: severity.source };
    }

    private static skip(definition: CheckDefinition, severity: EffectiveSeverity, reason: string): ResolvedCheck {
        return { definition, severity: severity.value, skipped: true, skipReason: reason, overrideSource: severity.source };
    }

    private static appliesToContentType(definition: CheckDefinition, contentType: ContentType): boolean {
        if (definition.contentTypes !== undefined && !definition.contentTypes.includes(contentType)) {
            return false;
        }

        return definition.excludedContentTypes === undefined || !definition.excludedContentTypes.includes(contentType);
    }

    private static effectiveSeverity(
        definition: CheckDefinition,
        configOverrides: readonly SeverityOverride[],
        commandLineOverrides: readonly SeverityOverride[]
    ): EffectiveSeverity {
        const fromCommandLine = CheckSetResolver.findOverride(commandLineOverrides, CheckIds.of(definition));

        if (fromCommandLine !== undefined) {
            return { value: fromCommandLine, source: "command line" };
        }

        const fromConfig = CheckSetResolver.findOverride(configOverrides, CheckIds.of(definition));

        if (fromConfig !== undefined) {
            return { value: fromConfig, source: "config" };
        }

        return { value: definition.severity };
    }

    private static findOverride(overrides: readonly SeverityOverride[], id: string): Severity | undefined {
        const exact = overrides.findLast((override) => override.target === id);

        if (exact !== undefined) {
            return exact.severity;
        }

        const group = CheckIds.groupOf(id);
        const groupWide = overrides.findLast((override) => override.target === group);

        return groupWide?.severity;
    }

    private static assertKnown(definitions: readonly CheckDefinition[], selector: SkipSelector): void {
        const groupExists = definitions.some((definition) => definition.group === selector.group);

        if (!groupExists) {
            throw new UsageError("Unknown check group: " + selector.group);
        }

        if (selector.from !== undefined && selector.to !== undefined) {
            CheckSetResolver.assertRangeMatches(definitions, selector);

            return;
        }

        if (selector.numbers === undefined) {
            return;
        }

        for (const number of selector.numbers) {
            const id = selector.group + "/" + number;

            if (!definitions.some((definition) => CheckIds.of(definition) === id)) {
                throw new UsageError("Unknown check ID: " + id);
            }
        }
    }

    private static assertRangeMatches(definitions: readonly CheckDefinition[], selector: SkipSelector): void {
        if (definitions.some((definition) => CheckSetResolver.matches(selector, CheckIds.of(definition)))) {
            return;
        }

        throw new UsageError("No check ID in range: " + selector.group + "/" + selector.from + "-" + selector.to);
    }

    private static assertKnownTarget(definitions: readonly CheckDefinition[], target: string): void {
        const known = definitions.some((definition) => CheckIds.of(definition) === target || definition.group === target);

        if (!known) {
            throw new UsageError("Unknown check ID or group: " + target);
        }
    }
}

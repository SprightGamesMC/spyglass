import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonValue } from "../../Types/LoaderTypes.js";
import type { ContentItem, ItemKind, PackType } from "../../Types/ModelTypes.js";
import type { Schema, SchemaIssue, SchemaIssueKind } from "../../Types/SchemaTypes.js";
import FormatVersionReader from "../../Loaders/FormatVersionReader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import SchemaValidator from "../../Loaders/SchemaValidator.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";
import CommonLimits from "./CommonLimits.js";

export default abstract class SchemaInvalidCheck extends Check {
    static readonly KIND_LABELS: Readonly<Record<SchemaIssueKind, string>> = {
        missing_required: "missing required field",
        wrong_type: "wrong value type",
        not_in_enum: "value not in the allowed list",
        unknown_type: "unknown definition type",
        structure: "other structure",
    };

    protected abstract readonly kinds: readonly ItemKind[];
    protected readonly packType?: PackType;

    private static describeGroup(kind: SchemaIssueKind, group: readonly SchemaIssue[]): string {
        const listed = group.slice(0, CommonLimits.SCHEMA_LISTED_PATH_LIMIT).map((issue) => (issue.path === "" ? "root" : issue.path));
        const suffix = group.length > listed.length ? ", ..." : "";
        const noun = group.length === 1 ? "issue" : "issues";

        return group.length + " " + SchemaInvalidCheck.KIND_LABELS[kind] + " " + noun + ": " + listed.join(", ") + suffix;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, this.kinds, this.packType)) {
            if (!(await this.shouldValidate(context, item))) {
                continue;
            }

            const value = await context.loaders.json.readValue(item.path);
            const issues = SchemaValidator.validate(value, this.schemaFor(item, value));

            for (const [kind, group] of SchemaValidator.groupByKind(issues)) {
                findings.push(this.finding(SchemaInvalidCheck.describeGroup(kind, group), item.path, pack.root, { field: group[0].path }));
            }
        }

        return findings;
    }

    protected abstract schemaFor(item: ContentItem, value: JsonValue | undefined): Schema;

    protected requiresCurrentFormatVersion(_item: ContentItem): boolean {
        return false;
    }

    private async shouldValidate(context: CheckContext, item: ContentItem): Promise<boolean> {
        const object = await context.loaders.json.readObject(item.path);

        if (object === undefined) {
            return false;
        }

        if (!this.requiresCurrentFormatVersion(item)) {
            return true;
        }

        const result = await FormatVersionReader.read(context, item.path);

        if (result.status !== "ok" || result.version === undefined) {
            return false;
        }

        return VersionUtilities.compareMajorMinor(result.version, context.loaders.currentGameVersion) === 0;
    }
}

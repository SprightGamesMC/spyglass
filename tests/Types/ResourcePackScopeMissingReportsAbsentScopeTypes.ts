export interface ResourcePackScopeMissingReportsAbsentScopeCase {
    readonly name: string;
    readonly packScope?: string;
    readonly expectedIds: readonly string[];
    readonly expectedPaths: readonly string[];
}

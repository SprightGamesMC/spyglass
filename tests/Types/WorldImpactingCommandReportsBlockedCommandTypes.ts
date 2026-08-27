export interface WorldImpactingCommandReportsBlockedCommandCase {
    readonly name: string;
    readonly path: string;
    readonly content: string | object;
    readonly expectedLines: readonly (number | undefined)[];
}

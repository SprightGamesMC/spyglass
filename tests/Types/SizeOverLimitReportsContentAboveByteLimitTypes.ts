export interface SizeOverLimitReportsContentAboveByteLimitCase {
    readonly name: string;
    readonly packBytes: number;
    readonly outsideBytes: number;
    readonly expectFinding: boolean;
}

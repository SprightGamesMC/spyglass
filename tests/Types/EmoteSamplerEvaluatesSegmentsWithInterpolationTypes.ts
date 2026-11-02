export interface EmoteSamplerEvaluatesSegmentsWithInterpolationCase {
    readonly name: string;
    readonly channel: Record<string, unknown>;
    readonly time: number;
    readonly expectedY: number;
}

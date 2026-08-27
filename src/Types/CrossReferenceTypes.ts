export type LinkKind =
    | "geometry"
    | "texture"
    | "texture_prefix"
    | "animation"
    | "animation_alias"
    | "render_controller"
    | "sound"
    | "sound_event"
    | "entity"
    | "item"
    | "particle";

export type LinkResolution = "defined" | "vanilla" | "missing";

interface LinkDefinition {
    readonly kind: LinkKind;
    readonly id: string;
    readonly path: string;
    readonly pack: string;
}

export interface LinkReference {
    readonly kind: LinkKind;
    readonly id: string;
    readonly path: string;
    readonly pack: string;
    readonly field?: string;
}

export interface LinkCollection {
    readonly definitions: LinkDefinition[];
    readonly references: LinkReference[];
}

export interface CrossReferenceIndex {
    readonly references: readonly LinkReference[];
    readonly definedIds: ReadonlyMap<LinkKind, ReadonlySet<string>>;
}

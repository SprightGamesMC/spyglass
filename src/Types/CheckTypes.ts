import type Loaders from "../Loaders/Loaders.js";
import type { OverrideSource } from "./CliTypes.js";
import type { ContentModel } from "./ModelTypes.js";

export type Severity = "error" | "warning" | "recommendation";

export type ContentType = "addon" | "world" | "skin" | "texture" | "persona";

export type Layout = "standard" | "marketplace";

export type CheckGroup =
    | "FILE"
    | "PACK"
    | "MANIFEST"
    | "LANG"
    | "TEXTURE"
    | "MODEL"
    | "SOUND"
    | "PARTICLE"
    | "SCRIPT"
    | "ENTITY"
    | "BLOCK"
    | "DEFINITION"
    | "WORLD"
    | "CHUNK"
    | "TEXTUREPACK"
    | "SKIN"
    | "PERSONA"
    | "EMOTE"
    | "MARKETPLACE"
    | "ART"
    | "ADDON";

export interface CheckDefinition {
    readonly group: CheckGroup;
    readonly number: number;
    readonly slug: string;
    readonly severity: Severity;
    readonly description: string;
    readonly contentTypes?: readonly ContentType[];
    readonly excludedContentTypes?: readonly ContentType[];
}

export interface FindingLocation {
    readonly field?: string;
    readonly line?: number;
}

export interface Finding {
    readonly id: string;
    readonly slug: string;
    readonly severity: Severity;
    readonly message: string;
    readonly path?: string;
    readonly pack?: string;
    readonly location?: FindingLocation;
}

export interface CheckContext {
    readonly model: ContentModel;
    readonly loaders: Loaders;
    readonly contentType: ContentType;
}

export interface ResolvedCheck {
    readonly definition: CheckDefinition;
    readonly severity: Severity;
    readonly skipped: boolean;
    readonly skipReason?: string;
    readonly overrideSource?: OverrideSource;
}

export interface CheckProgress {
    readonly id: string;
    readonly durationMilliseconds: number;
    readonly findingCount: number;
}

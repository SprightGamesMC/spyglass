import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { GeometryVariant, PersonaSourceEntry } from "../../Types/PersonaTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class GeometryVariantMissing extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_VARIANT_MISSING,
        slug: "geometry-variant-missing",
        severity: "error",
        description: "Geometry is not provided for every required body size, arm size, or side",
    };

    private static requiredVariants(pieceType: string): GeometryVariant[] {
        const armSizes = GeometryVariantMissing.needsArmSizes(pieceType) ? PersonaLimits.ARM_SIZES : [undefined];
        const sides = GeometryVariantMissing.needsSides(pieceType) ? PersonaLimits.SIDES : [undefined];
        const variants: GeometryVariant[] = [];

        for (const bodySize of PersonaLimits.BODY_SIZES) {
            for (const armSize of armSizes) {
                for (const side of sides) {
                    variants.push({ bodySize, armSize, side });
                }
            }
        }

        return variants;
    }

    private static needsArmSizes(pieceType: string): boolean {
        return pieceType === PersonaLimits.ARM_REPLACEMENT_TYPE || pieceType === PersonaLimits.HAND_TYPE;
    }

    private static needsSides(pieceType: string): boolean {
        return pieceType === PersonaLimits.ARM_REPLACEMENT_TYPE || pieceType === PersonaLimits.LEG_REPLACEMENT_TYPE;
    }

    private static provides(source: PersonaSourceEntry, variant: GeometryVariant): boolean {
        return (
            GeometryVariantMissing.matches(source, "body_size", variant.bodySize) &&
            GeometryVariantMissing.matches(source, "arm_size", variant.armSize) &&
            GeometryVariantMissing.matches(source, "side", variant.side)
        );
    }

    private static matches(source: PersonaSourceEntry, field: string, expected: string | undefined): boolean {
        const actual = PersonaLoader.string(source.entry, field);

        return actual === undefined || expected === undefined || actual === expected;
    }

    private static describe(variant: GeometryVariant): string {
        return [variant.bodySize, variant.armSize, variant.side].filter((part) => part !== undefined).join(" ");
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const pieceType = PersonaLoader.string(data.meta, "piece_type");
            const sources = PersonaLoader.geometrySources(data.meta);

            if (pieceType === undefined || sources.length === 0 || data.metaPath === undefined) {
                continue;
            }

            for (const variant of GeometryVariantMissing.requiredVariants(pieceType)) {
                if (sources.some((source) => GeometryVariantMissing.provides(source, variant))) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "geometry_sources has no entry for " + GeometryVariantMissing.describe(variant) + " required by " + pieceType,
                        data.metaPath,
                        data.pack.root,
                        { field: "geometry_sources" }
                    )
                );
            }
        }

        return findings;
    }
}

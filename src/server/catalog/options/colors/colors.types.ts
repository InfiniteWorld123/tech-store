import type z from "zod";
import type {
    createColorSchema,
    deleteColorSchema,
    deleteColorsSchema,
    listColorsSchema,
    updateColorSchema,
} from "./colors.schemas";

// type helpers
export type Color = {
    id: string;
    name: string;
    hexCode: string | null;
    createdAt: string;
    updatedAt: string;
};

// input types
export type CreateColorInputType = z.infer<typeof createColorSchema>;

export type DeleteColorInputType = z.infer<typeof deleteColorSchema>;

export type DeleteColorsInputType = z.infer<typeof deleteColorsSchema>;

export type ListColorsInputType = z.infer<typeof listColorsSchema>;

export type UpdateColorInputType = z.infer<typeof updateColorSchema>;

// output types
export type CreateColorOutputType = Color;

export type DeleteColorOutputType = Color;

export type DeleteColorsOutputType = { deletedColors: Color[] };

export type ListColorsOutputType = { colors: Color[] };

export type UpdateColorOutputType = Color;

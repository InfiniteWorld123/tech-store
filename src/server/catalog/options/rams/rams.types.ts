
import type z from "zod";
import type { createRamSchema, deleteRamSchema, deleteRamsSchema, listRamsSchema, updateRamSchema } from "./rams.schemas";

// helpers types
export type Ram = {
    id: string;
    name: string;
    valueGb: number;
    createdAt: string;
    updatedAt: string;
};

// input types
export type CreateRamInputType = z.infer<typeof createRamSchema>;

export type DeleteRamInputType = z.infer<typeof deleteRamSchema>;

export type DeleteRamsInputType = z.infer<typeof deleteRamsSchema>;

export type UpdateRamInputType = z.infer<typeof updateRamSchema>;

export type ListRamsInputType = z.infer<typeof listRamsSchema>;

// output types
export type CreateRamOutputType = Ram;

export type DeleteRamOutputType = Ram;

export type DeleteRamsOutputType = { rams: Ram[] };

export type UpdateRamOutputType = Ram;

export type ListRamsOutputType = {
    rams: Ram[];
    query: {
      searching?: ListRamsInputType["searching"];
    };
  };

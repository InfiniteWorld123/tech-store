import type z from "zod";
import type {
	createRamSchema,
	deleteRamSchema,
	deleteRamsSchema,
	listRamsSchema,
	updateRamSchema,
} from "./rams.schemas";

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
export type CreateRamOutputType = {
	ram: Ram;
};

export type DeleteRamOutputType = {
	ramId: DeleteRamInputType["ramId"];
};

export type DeleteRamsOutputType = {
	ramIds: DeleteRamsInputType["ramIds"];
};

export type UpdateRamOutputType = {
	ram: Ram;
};

export type ListRamsOutputType = {
	items: Ram[];
	query: {
		searching?: ListRamsInputType["searching"];
	};
};

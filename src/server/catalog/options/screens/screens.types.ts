import type z from "zod";
import type {
	createScreenSchema,
	deleteScreenSchema,
	deleteScreensSchema,
	listScreensSchema,
	updateScreenSchema,
} from "./screens.schemas";

// helper types
export type Screen = {
	id: string;
	name: string;
	valueInches: number;
	createdAt: string;
	updatedAt: string;
};

// input types
export type CreateScreenInputType = z.infer<typeof createScreenSchema>;

export type DeleteScreenInputType = z.infer<typeof deleteScreenSchema>;

export type DeleteScreensInputType = z.infer<typeof deleteScreensSchema>;

export type ListScreensInputType = z.infer<typeof listScreensSchema>;

export type UpdateScreenInputType = z.infer<typeof updateScreenSchema>;

// output types
export type CreateScreenOutputType = {
	screen: Screen;
};

export type DeleteScreenOutputType = {
	screenId: DeleteScreenInputType["screenId"];
};

export type DeleteScreensOutputType = {
	screenIds: DeleteScreensInputType["screenIds"];
};

export type ListScreensOutputType = {
	items: Screen[];
	query: {
		searching?: ListScreensInputType["searching"];
	};
};

export type UpdateScreenOutputType = {
	screen: Screen;
};

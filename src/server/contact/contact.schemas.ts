import { z } from "zod";

export const contactMessageSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
	email: z.string().trim().email("Enter a valid email address").max(120),
	subject: z
		.string()
		.trim()
		.min(3, "Subject must be at least 3 characters")
		.max(120),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters")
		.max(2000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

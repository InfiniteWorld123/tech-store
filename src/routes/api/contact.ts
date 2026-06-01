import { createFileRoute } from "@tanstack/react-router";
import { env } from "#/constants/env";
import { sendEmail } from "#/lib/mailer";
import { contactMessageSchema } from "#/server/contact/contact.schemas";

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

export const Route = createFileRoute("/api/contact")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				try {
					const payload = await request.json();
					const result = contactMessageSchema.safeParse(payload);

					if (!result.success) {
						return Response.json(
							{
								message: "Please check the form and try again.",
								issues: result.error.flatten().fieldErrors,
							},
							{ status: 400 },
						);
					}

					const { name, email, subject, message } = result.data;
					const html = `
						<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111827">
							<h1 style="font-size:20px;margin:0 0 16px">New TechStore contact message</h1>
							<p><strong>Name:</strong> ${escapeHtml(name)}</p>
							<p><strong>Email:</strong> ${escapeHtml(email)}</p>
							<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
							<div style="margin-top:20px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb">
								${escapeHtml(message).replaceAll("\n", "<br />")}
							</div>
						</div>
					`;

					await sendEmail({
						to: env.CONTACT_EMAIL,
						subject: `TechStore contact: ${subject}`,
						html,
						replyTo: email,
					});

					return Response.json({ message: "Message sent" });
				} catch (_error) {
					return Response.json(
						{ message: "We could not send your message right now." },
						{ status: 500 },
					);
				}
			},
		},
	},
});

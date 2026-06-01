import { createServerFn } from "@tanstack/react-start";
import { env } from "#/constants/env";
import { sendEmail } from "#/lib/mailer";
import { contactMessageSchema } from "./contact.schemas";

const esc = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

export const sendContactEmailAction = createServerFn({ method: "POST" })
	.inputValidator(contactMessageSchema)
	.handler(async ({ data }) => {
		await sendEmail({
			to: env.CONTACT_EMAIL,
			subject: `[TechStore] ${data.subject}`,
			html: `
				<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px">
					<h1 style="font-size:20px;margin:0 0 16px">New TechStore contact message</h1>
					<p><strong>Name:</strong> ${esc(data.name)}</p>
					<p><strong>Email:</strong> ${esc(data.email)}</p>
					<p><strong>Subject:</strong> ${esc(data.subject)}</p>
					<div style="margin-top:20px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb">
						${esc(data.message).replaceAll("\n", "<br />")}
					</div>
				</div>
			`,
			replyTo: data.email,
		});
	});

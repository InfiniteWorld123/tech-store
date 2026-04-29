import { Resend } from "resend";
import { env } from "#/constants/env";
import { handleError } from "../errors/error-handler";

const resend = new Resend(env.RESEND);

type SendEmailProps = {
	to: string;
	subject: string;
	html: string;
	replyTo?: string;
};

export const sendEmail = async ({
	to,
	subject,
	html,
	replyTo,
}: SendEmailProps) => {
	try {
		const { error } = await resend.emails.send({
			from: env.EMAIL_FROM,
			to,
			subject,
			html,
			replyTo,
		});
		if (error) throw error;
	} catch (error) {
		throw handleError(error);
	}
};

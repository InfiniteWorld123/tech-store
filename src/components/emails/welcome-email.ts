import { emailLayout } from "./shared";

type WelcomeEmailProps = {
	name?: string | null;
	url: string;
};

export const welcomeEmailTemplate = ({ name, url }: WelcomeEmailProps) =>
	emailLayout({
		preview: "Your Tech Store account is ready.",
		title: "Welcome to Tech Store",
		body: `Hi ${name || "there"},

Your account has been created successfully. You can now sign in, explore products, and manage your shopping experience from your account.`,
		action: {
			label: "Go to Tech Store",
			url,
		},
		footer: "Thanks for joining Tech Store.",
	});

const getEnvVar = (key: string) => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		throw new Error(`Environment variable ${key} is missing`);
	}
	return value;
};

export const env = {
	BASE_URL: getEnvVar("BASE_URL"),
	// API_KEY: getEnvVar("BETTER_AUTH_SECRET"),
	DATABASE_URL: getEnvVar("DATABASE_URL"),
	// RESEND: getEnvVar("RESEND"),
	// EMAIL_FROM:
	// 	getOptionalEnvVar("EMAIL_FROM") ?? "StoryNest <noreply@storynest.app>",
	// CONTACT_TO_EMAIL: getOptionalEnvVar("CONTACT_TO_EMAIL"),
	// UPLOADTHING_TOKEN: getOptionalEnvVar("UPLOADTHING_TOKEN"),
	// ENABLE_SEED_ROUTES: getBooleanEnvVar("ENABLE_SEED_ROUTES", false),
} as const;

export type EnvVariables = typeof env;

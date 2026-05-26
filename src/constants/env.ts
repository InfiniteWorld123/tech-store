const getEnvVar = (key: string) => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		throw new Error(`Environment variable ${key} is missing`);
	}
	return value;
};

const getOptionalEnvVar = (key: string) => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		return undefined;
	}
	return value;
};

export const env = {
	BASE_URL: getEnvVar("BASE_URL"),
	DATABASE_URL: getEnvVar("DATABASE_URL"),
	RESEND: getEnvVar("RESEND"),
	EMAIL_FROM:
		getOptionalEnvVar("EMAIL_FROM") ?? "Tech Store <no-reply@yamanwarda.dev>",
	// UPLOADTHING_TOKEN: getOptionalEnvVar("UPLOADTHING_TOKEN"),
} as const;

export type EnvVariables = typeof env;

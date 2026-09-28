import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { writeSeed } from "./seed.database";
import {
	buildSeedData,
	DEFAULT_IMAGE_BASE_URL,
	seedSummary,
} from "./seed.generator";

const databaseUrl = process.env.DATABASE_URL;
const imageBaseUrl =
	process.env.BASE_URL?.replace(/\/$/, "") ?? DEFAULT_IMAGE_BASE_URL;
const data = buildSeedData(new Date(), imageBaseUrl);

if (process.argv.includes("--dry-run")) {
	console.info("Tech Store seed dry run", seedSummary(data));
} else {
	if (!databaseUrl) throw new Error("DATABASE_URL is required to seed");
	const written = await writeSeed(drizzle({ client: neon(databaseUrl) }), data);
	console.info("Tech Store seed complete", { ...seedSummary(data), written });
}

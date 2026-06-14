import { eq } from "drizzle-orm";
import type { FileRouter } from "uploadthing/server";
import { createUploadthing, UploadThingError } from "uploadthing/server";
import { db } from "#/db/drizzle";
import { user } from "#/db/schema";
import { auth } from "#/lib/auth-server";
import { isAdminRole } from "./auth/user-roles";

const f = createUploadthing();

async function requireAdminUpload(req: Request) {
	const session = await auth.api.getSession({ headers: req.headers });

	if (!session) {
		throw new UploadThingError("Unauthorized");
	}

	const [currentUser] = await db
		.select({ id: user.id, role: user.role })
		.from(user)
		.where(eq(user.id, session.user.id));

	if (!isAdminRole(currentUser?.role)) {
		throw new UploadThingError("Admin access is required");
	}

	return { id: currentUser.id };
}

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req }) => {
			const admin = await requireAdminUpload(req);

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: admin.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);

			console.log("file url", file.ufsUrl);

			// Whatever is returned here is sent to onClientUploadComplete.
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

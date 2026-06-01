import { describe, expect, it } from "vitest";
import { isAdminRole, USER_ROLES } from "./user-roles";

describe("isAdminRole", () => {
	it("allows admin users", () => {
		expect(isAdminRole(USER_ROLES.admin)).toBe(true);
	});

	it("blocks customer and missing roles", () => {
		expect(isAdminRole(USER_ROLES.customer)).toBe(false);
		expect(isAdminRole(undefined)).toBe(false);
		expect(isAdminRole(null)).toBe(false);
	});
});

export const USER_ROLES = {
	customer: "customer",
	admin: "admin",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const isAdminRole = (
	role: string | null | undefined,
): role is typeof USER_ROLES.admin => {
	return role === USER_ROLES.admin;
};

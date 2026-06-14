"use client";

import { Form, Skeleton, toast } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2, KeyRound, Lock, Mail, Shield, User } from "lucide-react";
import type { ReactNode } from "react";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { changePassword, useSession } from "#/lib/auth-client";
import { ChangePasswordSchema } from "#/server/auth/auth.schemas";

export function SettingsPage() {
	const { data: session, isPending } = useSession();

	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: ChangePasswordSchema,
			onChange: ChangePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await changePassword({
				currentPassword: value.currentPassword,
				newPassword: value.newPassword,
			});

			if (error) {
				toast.danger(error.message || "Failed to change password.");
				return;
			}

			toast.success("Password changed successfully");
			reset();
		},
	});
	const { reset, Subscribe, Field, handleSubmit } = form;

	const user = session?.user;
	const role = user?.role ?? "customer";
	const emailVerified = Boolean(user?.emailVerified);

	return (
		<div className="space-y-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Settings</h1>
				<p className="text-sm text-muted mt-0.5">
					Manage your admin account and password.
				</p>
			</div>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
				<section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
							<User size={18} />
						</div>
						<div>
							<h2 className="font-semibold text-foreground">Account</h2>
							<p className="text-sm text-muted">Signed-in admin details</p>
						</div>
					</div>

					<div className="mt-5 divide-y divide-border">
						<AccountRow
							icon={<User size={16} />}
							label="Name"
							isLoading={isPending}
							value={user?.name ?? "Unknown user"}
						/>
						<AccountRow
							icon={<Mail size={16} />}
							label="Email"
							isLoading={isPending}
							value={user?.email ?? "No email available"}
						/>
						<AccountRow
							icon={<Shield size={16} />}
							label="Role"
							isLoading={isPending}
							value={role}
						/>
						<AccountRow
							icon={<CheckCircle2 size={16} />}
							label="Email status"
							isLoading={isPending}
							value={emailVerified ? "Verified" : "Not verified"}
							valueClassName={emailVerified ? "text-success" : "text-warning"}
						/>
					</div>
				</section>

				<section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-surface-tertiary text-foreground">
							<KeyRound size={18} />
						</div>
						<div>
							<h2 className="font-semibold text-foreground">Change password</h2>
							<p className="text-sm text-muted">
								Use a strong password you do not use elsewhere.
							</p>
						</div>
					</div>

					<Form
						className="mt-5 flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
					>
						<Field name="currentPassword">
							{(field) => {
								return (
									<InputField
										value={field.state.value}
										onChange={(v) => field.handleChange(v)}
										type="password"
										label="Current password"
										placeholder="Enter current password"
										autoComplete="current-password"
										icon={<Lock size={16} />}
										errorText={getAdminFieldError(field, form)}
									/>
								);
							}}
						</Field>

						<Field name="newPassword">
							{(field) => {
								return (
									<InputField
										value={field.state.value}
										onChange={(v) => field.handleChange(v)}
										type="password"
										label="New password"
										placeholder="Enter new password"
										autoComplete="new-password"
										icon={<Lock size={16} />}
										errorText={getAdminFieldError(field, form)}
									/>
								);
							}}
						</Field>

						<Field name="confirmPassword">
							{(field) => {
								return (
									<InputField
										value={field.state.value}
										onChange={(v) => field.handleChange(v)}
										type="password"
										label="Confirm new password"
										placeholder="Confirm new password"
										autoComplete="new-password"
										icon={<Lock size={16} />}
										errorText={getAdminFieldError(field, form)}
									/>
								);
							}}
						</Field>

						<Subscribe>
							{({ isSubmitting }) => (
								<SubmitButton
									isLoading={isSubmitting}
									loadingText="Changing password..."
									className="sm:w-fit"
									fullWidth={false}
								>
									Change password
								</SubmitButton>
							)}
						</Subscribe>
					</Form>
				</section>
			</div>
		</div>
	);
}

type AccountRowProps = {
	icon: ReactNode;
	label: string;
	value: string;
	isLoading: boolean;
	valueClassName?: string;
};

function AccountRow({
	icon,
	label,
	value,
	isLoading,
	valueClassName,
}: AccountRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
			<div className="flex min-w-0 items-center gap-2 text-sm text-muted">
				<span className="shrink-0">{icon}</span>
				<span>{label}</span>
			</div>
			{isLoading ? (
				<Skeleton className="h-5 w-32 rounded-md" />
			) : (
				<p
					className={[
						"truncate text-right text-sm font-medium text-foreground",
						valueClassName,
					]
						.filter(Boolean)
						.join(" ")}
				>
					{value}
				</p>
			)}
		</div>
	);
}

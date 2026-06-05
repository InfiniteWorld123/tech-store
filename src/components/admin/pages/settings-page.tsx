"use client";

import { Card, Form, toast } from "@heroui/react";
import { useEffect, useState } from "react";
import { InputField } from "#/components/ui/fields/input-field";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import {
	changeEmail,
	changePassword,
	updateUser,
	useSession,
} from "#/lib/auth-client";

// ─── Update name ──────────────────────────────────────────────────────────────

function UpdateNameSection() {
	const session = useSession();
	const [name, setName] = useState("");
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		if (session.data?.user.name) {
			setName(session.data.user.name);
		}
	}, [session.data?.user.name]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setIsPending(true);
		const { error } = await updateUser({ name: name.trim() });
		setIsPending(false);
		if (error) {
			toast.danger(error.message ?? "Failed to update name.");
		} else {
			toast.success("Display name updated.");
		}
	}

	return (
		<Card>
			<Card.Header>
				<Card.Title className="text-base">Display name</Card.Title>
				<Card.Description>
					Update the name shown across your account
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<InputField
						label="Name"
						value={name}
						onChange={setName}
						placeholder="Your name"
						autoComplete="name"
						isRequired
						isDisabled={isPending}
					/>
					<div>
						<SubmitButton
							isPending={isPending}
							loadingText="Saving..."
							fullWidth={false}
						>
							Save changes
						</SubmitButton>
					</div>
				</Form>
			</Card.Content>
		</Card>
	);
}

// ─── Change email ─────────────────────────────────────────────────────────────

function ChangeEmailSection() {
	const session = useSession();
	const [newEmail, setNewEmail] = useState("");
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!newEmail.trim()) return;
		setIsPending(true);
		const { error } = await changeEmail({
			newEmail: newEmail.trim(),
			callbackURL: "/admin/settings",
		});
		setIsPending(false);
		if (error) {
			toast.danger(error.message ?? "Failed to update email.");
		} else {
			toast.success("Verification email sent — check your new inbox.");
			setNewEmail("");
		}
	}

	return (
		<Card>
			<Card.Header>
				<Card.Title className="text-base">Email address</Card.Title>
				<Card.Description>
					{session.data?.user.email
						? `Current: ${session.data.user.email}`
						: "Change the email linked to your account"}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<InputField
						label="New email address"
						value={newEmail}
						onChange={setNewEmail}
						type="email"
						placeholder="new@example.com"
						autoComplete="email"
						isRequired
						isDisabled={isPending}
					/>
					<p className="text-xs text-muted">
						A verification link will be sent to your new address. The change
						only applies once you confirm it.
					</p>
					<div>
						<SubmitButton
							isPending={isPending}
							loadingText="Sending..."
							fullWidth={false}
						>
							Update email
						</SubmitButton>
					</div>
				</Form>
			</Card.Content>
		</Card>
	);
}

// ─── Change password ──────────────────────────────────────────────────────────

function ChangePasswordSection() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.danger("New passwords do not match.");
			return;
		}
		if (newPassword.length < 8) {
			toast.danger("Password must be at least 8 characters.");
			return;
		}
		setIsPending(true);
		const { error } = await changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
		});
		setIsPending(false);
		if (error) {
			toast.danger(error.message ?? "Failed to change password.");
		} else {
			toast.success("Password changed successfully.");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		}
	}

	return (
		<Card>
			<Card.Header>
				<Card.Title className="text-base">Password</Card.Title>
				<Card.Description>Change your account password</Card.Description>
			</Card.Header>
			<Card.Content>
				<Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<InputField
						label="Current password"
						value={currentPassword}
						onChange={setCurrentPassword}
						type="password"
						placeholder="••••••••"
						autoComplete="current-password"
						isRequired
						isDisabled={isPending}
					/>
					<InputField
						label="New password"
						value={newPassword}
						onChange={setNewPassword}
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						isRequired
						isDisabled={isPending}
					/>
					<InputField
						label="Confirm new password"
						value={confirmPassword}
						onChange={setConfirmPassword}
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						isRequired
						isDisabled={isPending}
					/>
					<p className="text-xs text-muted">
						All other active sessions will be signed out after the change.
					</p>
					<div>
						<SubmitButton
							isPending={isPending}
							loadingText="Changing..."
							fullWidth={false}
						>
							Change password
						</SubmitButton>
					</div>
				</Form>
			</Card.Content>
		</Card>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SettingsPage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex max-w-2xl flex-col gap-4">
				<UpdateNameSection />
				<ChangeEmailSection />
				<ChangePasswordSection />
			</div>
		</div>
	);
}

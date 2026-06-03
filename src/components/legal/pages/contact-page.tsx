"use client";

import { Alert, Button, Card, Form } from "@heroui/react";
import {
	Headphones,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	Send,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { InfoCard } from "#/components/legal/sections/info-card";
import { PublicPageLayout } from "#/components/legal/sections/public-page-layout";
import { InputField } from "#/components/ui/fields/input-field";
import { TextareaField } from "#/components/ui/fields/textarea-field";

type ContactState = "idle" | "loading" | "success" | "error";

export function ContactPage() {
	const [state, setState] = useState<ContactState>("idle");
	const [error, setError] = useState("");

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setState("loading");
		setError("");

		const formData = new FormData(event.currentTarget);
		const payload = {
			name: String(formData.get("name") ?? ""),
			email: String(formData.get("email") ?? ""),
			subject: String(formData.get("subject") ?? ""),
			message: String(formData.get("message") ?? ""),
		};

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const body = await response.json().catch(() => null);
				throw new Error(body?.message ?? "Message could not be sent.");
			}

			event.currentTarget.reset();
			setState("success");
		} catch (submitError) {
			setState("error");
			setError(
				submitError instanceof Error
					? submitError.message
					: "Message could not be sent.",
			);
		}
	};

	return (
		<PublicPageLayout
			eyebrow="Customer care"
			title="Contact TechStore support."
			description="Questions about an order, return, warranty, or the demo checkout? Send a message and the Berlin support desk will reply as soon as possible."
			icon={Headphones}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
						<div className="space-y-6">
							<InfoCard
								icon={Mail}
								title="Email"
								description="support@techstore-demo.de"
							/>
							<InfoCard
								icon={Phone}
								title="Phone"
								description="+49 30 5557 1840, Monday to Friday, 09:00-18:00 CET"
							/>
							<InfoCard
								icon={MapPin}
								title="Berlin demo office"
								description="TechStore Demo GmbH, Invalidenstrasse 117, 10115 Berlin, Germany"
							/>
							<Card variant="secondary" className="p-6">
								<div className="flex h-56 items-center justify-center rounded-xl bg-surface p-6 text-center">
									<div>
										<MapPin className="mx-auto text-accent mb-3" size={34} />
										<p className="font-semibold text-foreground">
											Berlin Mitte
										</p>
										<p className="text-sm text-muted mt-1">
											Demo map placeholder for a portfolio shop
										</p>
									</div>
								</div>
							</Card>
						</div>

						<Card className="p-6 shadow-sm sm:p-8">
							<div className="mb-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
									<MessageSquare size={22} />
								</div>
								<h2 className="text-2xl font-bold text-foreground">
									Send a message
								</h2>
								<p className="text-muted mt-2">
									This portfolio form is wired like a real store contact flow
									and sends email through Resend.
								</p>
							</div>

							<Form className="grid gap-4" onSubmit={onSubmit}>
								<div className="grid sm:grid-cols-2 gap-4">
									<InputField
										name="name"
										label="Name"
										placeholder="Mina Becker"
										isRequired
									/>
									<InputField
										name="email"
										label="Email"
										type="email"
										placeholder="mina@example.com"
										isRequired
									/>
								</div>
								<InputField
									name="subject"
									label="Subject"
									placeholder="Question about my order"
									isRequired
								/>
								<TextareaField
									name="message"
									label="Message"
									placeholder="Tell us what you need help with..."
									isRequired
									textAreaProps={{
										minLength: 10,
										maxLength: 2000,
										rows: 7,
									}}
								/>
								<Button
									type="submit"
									variant="primary"
									isPending={state === "loading"}
									className="w-full sm:w-auto"
								>
									<Send size={16} />
									{state === "loading" ? "Sending..." : "Send message"}
								</Button>
							</Form>

							{state === "success" ? (
								<Alert status="success" className="mt-4">
									<Alert.Indicator />
									<Alert.Content>
										<Alert.Title>Your message was sent.</Alert.Title>
										<Alert.Description>
											We will reply to your email address.
										</Alert.Description>
									</Alert.Content>
								</Alert>
							) : null}
							{state === "error" ? (
								<Alert status="danger" className="mt-4">
									<Alert.Indicator />
									<Alert.Content>
										<Alert.Title>{error}</Alert.Title>
									</Alert.Content>
								</Alert>
							) : null}

							<Alert status="accent" className="mt-6">
								<Alert.Indicator>
									<ShieldCheck size={18} />
								</Alert.Indicator>
								<Alert.Content>
									<Alert.Description>
										We only use your message details to answer your request.
										Legal-style details are explained in the Privacy page.
									</Alert.Description>
								</Alert.Content>
							</Alert>
						</Card>
					</div>
				</div>
			</section>
		</PublicPageLayout>
	);
}

"use client";

import { toast } from "@heroui/react";
import { useState } from "react";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import LinkButton from "#/components/ui/buttons/link-button";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { sendContactEmailAction } from "#/server/contact/contact.actions";
import {
	contactMessageSchema,
	type ContactMessageInput,
} from "#/server/contact/contact.schemas";
import { ArrowRight, Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";

const INFO_CARDS = [
	{
		icon: Mail,
		title: "Email Us",
		value: "support@techstore.com",
		detail: "We reply within 2 hours",
		color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
	},
	{
		icon: Phone,
		title: "Call Us",
		value: "+1 (800) 123-4567",
		detail: "Mon–Fri, 9am–6pm EST",
		color: "text-green-500 bg-green-100 dark:bg-green-900/30",
	},
	{
		icon: Clock,
		title: "Business Hours",
		value: "Mon–Fri, 9am–6pm",
		detail: "Eastern Standard Time",
		color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
	},
];

type FormField = keyof ContactMessageInput;

const DEFAULT_VALUES: ContactMessageInput = {
	name: "",
	email: "",
	subject: "",
	message: "",
};

export function ContactPage() {
	const [fields, setFields] = useState<ContactMessageInput>(DEFAULT_VALUES);
	const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
	const [submitting, setSubmitting] = useState(false);

	const setField = (key: FormField) => (value: string) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		}
	};

	const validate = (): boolean => {
		const result = contactMessageSchema.safeParse(fields);
		if (!result.success) {
			const fieldErrors: Partial<Record<FormField, string>> = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as FormField;
				if (!fieldErrors[key]) {
					fieldErrors[key] = issue.message;
				}
			}
			setErrors(fieldErrors);
			return false;
		}
		setErrors({});
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setSubmitting(true);
		try {
			await sendContactEmailAction({ data: fields });
			toast.success("Message sent! We'll get back to you within 2 hours.");
			setFields(DEFAULT_VALUES);
		} catch {
			toast.danger(
				"Failed to send your message. Please try again or email us directly.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				{/* Hero */}
				<section className="relative min-h-[50vh] flex items-center overflow-hidden bg-foreground">
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage: `linear-gradient(to right, oklch(99.11% 0 0) 1px, transparent 1px),
								linear-gradient(to bottom, oklch(99.11% 0 0) 1px, transparent 1px)`,
							backgroundSize: "60px 60px",
						}}
					/>
					<div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-8">
								<MessageSquare size={14} />
								We'd love to hear from you
							</div>
							<h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
								Get in <span className="text-accent">Touch</span>
							</h1>
							<p className="text-lg text-white/60 leading-relaxed">
								Have a question about an order, a product, or just want to say
								hello? Our team is here and ready to help.
							</p>
						</div>
					</div>
				</section>

				{/* Info Cards */}
				<section className="py-16 bg-surface-secondary border-y border-border">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							{INFO_CARDS.map(({ icon: Icon, title, value, detail, color }) => (
								<div
									key={title}
									className="flex items-start gap-4 p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
								>
									<div
										className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
									>
										<Icon size={22} />
									</div>
									<div>
										<p className="font-semibold text-foreground mb-0.5">
											{title}
										</p>
										<p className="text-sm font-medium text-foreground/80 mb-0.5">
											{value}
										</p>
										<p className="text-xs text-muted">{detail}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Form + Map */}
				<section className="py-24 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							{/* Form */}
							<div>
								<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
									Send a Message
								</p>
								<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
									We'll get back to you in under 2 hours.
								</h2>

								<form onSubmit={handleSubmit} className="flex flex-col gap-5">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<InputField
											label="Name"
											value={fields.name}
											onChange={setField("name")}
											placeholder="John Doe"
											errorText={errors.name}
											autoComplete="name"
										/>
										<InputField
											label="Email"
											type="email"
											value={fields.email}
											onChange={setField("email")}
											placeholder="you@example.com"
											errorText={errors.email}
											autoComplete="email"
										/>
									</div>

									<InputField
										label="Subject"
										value={fields.subject}
										onChange={setField("subject")}
										placeholder="How can we help you?"
										errorText={errors.subject}
									/>

									<div className="flex flex-col gap-1.5">
										<span className="text-sm font-medium text-foreground">
											Message
										</span>
										<textarea
											className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
											rows={6}
											placeholder="Tell us how we can help..."
											value={fields.message}
											onChange={(e) => setField("message")(e.target.value)}
											maxLength={2000}
										/>
										{errors.message ? (
											<span className="text-xs text-red-500">
												{errors.message}
											</span>
										) : (
											<span className="text-xs text-muted self-end">
												{fields.message.length} / 2000
											</span>
										)}
									</div>

									<SubmitButton isLoading={submitting} loadingText="Sending...">
										Send Message
									</SubmitButton>
								</form>
							</div>

							{/* Map + Location */}
							<div className="flex flex-col gap-6">
								{/* Fake map */}
								<div className="flex-1 rounded-2xl overflow-hidden border border-border relative min-h-[280px] bg-surface-secondary">
									<div
										className="absolute inset-0 opacity-[0.08]"
										style={{
											backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
												linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
											backgroundSize: "40px 40px",
										}}
									/>
									<div
										className="absolute inset-0 opacity-[0.04]"
										style={{
											backgroundImage: `linear-gradient(to right, currentColor 4px, transparent 4px),
												linear-gradient(to bottom, currentColor 4px, transparent 4px)`,
											backgroundSize: "120px 120px",
										}}
									/>
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="flex flex-col items-center gap-2">
											<div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
												<MapPin size={22} className="text-accent-foreground" />
											</div>
											<div className="bg-surface border border-border rounded-xl px-4 py-2 shadow-md text-center">
												<p className="text-sm font-semibold text-foreground">
													TechStore HQ
												</p>
												<p className="text-xs text-muted">San Francisco, CA</p>
											</div>
										</div>
									</div>
								</div>

								{/* Address card */}
								<div className="rounded-2xl border border-border bg-surface p-6">
									<div className="flex items-start gap-3 mb-4">
										<div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
											<MapPin size={18} className="text-accent" />
										</div>
										<div>
											<p className="font-semibold text-foreground mb-1">
												Our Location
											</p>
											<p className="text-sm text-muted leading-relaxed">
												123 Tech Lane, Suite 400
												<br />
												San Francisco, CA 94105
												<br />
												United States
											</p>
										</div>
									</div>
									<div className="pt-4 border-t border-border">
										<p className="text-xs text-muted">
											This is a portfolio project — the address above is a
											placeholder.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Footer CTA */}
				<section className="py-16 bg-surface-secondary border-t border-border">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<p className="text-muted mb-4 text-sm">Prefer to browse first?</p>
						<div className="flex flex-wrap justify-center gap-4">
							<LinkButton to="/" size="md" variant="primary">
								Shop Now <ArrowRight size={16} className="ml-1" />
							</LinkButton>
							<LinkButton to="/categories" size="md" variant="outline">
								Browse Categories
							</LinkButton>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}

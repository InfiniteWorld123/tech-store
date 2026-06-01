import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type InfoCardProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
};

export function InfoCard({
	icon: Icon,
	title,
	description,
	children,
	className,
}: InfoCardProps) {
	return (
		<div
			className={[
				"rounded-2xl border border-border bg-surface p-6 shadow-sm",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{Icon ? (
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
					<Icon size={22} />
				</div>
			) : null}
			<h3 className="font-semibold text-foreground text-lg">{title}</h3>
			{description ? (
				<p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
			) : null}
			{children ? <div className="mt-4">{children}</div> : null}
		</div>
	);
}

export function PolicySection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
			<h2 className="text-xl font-bold text-foreground">{title}</h2>
			<div className="mt-4 space-y-3 text-muted leading-relaxed">
				{children}
			</div>
		</section>
	);
}

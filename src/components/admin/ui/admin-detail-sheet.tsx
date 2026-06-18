import { Button } from "@heroui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type AdminDetailSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	title: ReactNode;
	subtitle?: ReactNode;
	badge?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
};

export function AdminDetailSheet({
	isOpen,
	onClose,
	title,
	subtitle,
	badge,
	children,
	footer,
}: AdminDetailSheetProps) {
	return (
		<>
			<button
				type="button"
				aria-label="Close details"
				onClick={onClose}
				tabIndex={isOpen ? 0 : -1}
				className={`fixed inset-0 z-40 cursor-default bg-black/40 transition-opacity duration-200 ${
					isOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>

			<aside
				aria-hidden={!isOpen}
				className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-border bg-surface shadow-xl transition-transform duration-200 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<header className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-3 py-4 sm:gap-4 sm:px-5">
					<div className="min-w-0">
						<div className="flex min-w-0 flex-wrap items-center gap-2">
							<h2 className="min-w-0 break-words text-base font-semibold text-foreground">
								{title}
							</h2>
							{badge}
						</div>
						{subtitle ? (
							<p className="mt-1 break-words text-sm text-muted">{subtitle}</p>
						) : null}
					</div>
					<Button
						type="button"
						isIconOnly
						size="sm"
						variant="ghost"
						onPress={onClose}
						aria-label="Close details"
						className="shrink-0 text-muted hover:text-foreground"
					>
						<X size={16} />
					</Button>
				</header>

				<div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
					{children}
				</div>

				{footer ? (
					<footer className="grid shrink-0 grid-cols-1 gap-2 border-t border-border px-3 py-4 sm:flex sm:flex-wrap sm:justify-end sm:px-5">
						{footer}
					</footer>
				) : null}
			</aside>
		</>
	);
}

export function DetailSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="space-y-3 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
			<h3 className="text-xs font-semibold uppercase text-muted">{title}</h3>
			{children}
		</section>
	);
}

export function DetailRow({
	label,
	value,
	mono = false,
}: {
	label: string;
	value: ReactNode;
	mono?: boolean;
}) {
	return (
		<div className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
			<p className="text-xs font-medium text-muted">{label}</p>
			<div
				className={[
					"min-w-0 text-sm text-foreground",
					mono ? "break-all font-mono text-xs" : "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{value}
			</div>
		</div>
	);
}

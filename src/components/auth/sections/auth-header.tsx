type Props = {
	title: string;
	subtitle?: string;
};

export function AuthHeader({ title, subtitle }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<h1 className="text-2xl font-semibold text-foreground">{title}</h1>
			{subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
		</div>
	);
}

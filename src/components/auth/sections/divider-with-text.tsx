type Props = {
	text: string;
};

export function DividerWithText({ text }: Props) {
	return (
		<div className="flex items-center gap-3">
			<div className="h-px flex-1 bg-separator" />
			<span className="text-xs uppercase tracking-wider text-muted">
				{text}
			</span>
			<div className="h-px flex-1 bg-separator" />
		</div>
	);
}

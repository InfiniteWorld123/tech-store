import { Separator } from "@heroui/react";

type Props = {
	text: string;
};

export function DividerWithText({ text }: Props) {
	return (
		<div className="flex items-center gap-3">
			<Separator className="flex-1" />
			<span className="text-xs uppercase tracking-wider text-muted">
				{text}
			</span>
			<Separator className="flex-1" />
		</div>
	);
}

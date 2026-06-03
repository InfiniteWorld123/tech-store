import LinkAnchor from "#/components/ui/buttons/link-anchor";

type Props = {
	prompt: string;
	linkLabel: string;
	linkTo: string;
};

export function AuthFooter({ prompt, linkLabel, linkTo }: Props) {
	return (
		<p className="text-center text-sm text-muted">
			{prompt}{" "}
			<LinkAnchor
				to={linkTo}
				className="font-medium text-accent hover:underline"
			>
				{linkLabel}
			</LinkAnchor>
		</p>
	);
}

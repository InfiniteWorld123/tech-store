import { Link } from "@tanstack/react-router";

type Props = {
	prompt: string;
	linkLabel: string;
	linkTo: string;
};

export function AuthFooter({ prompt, linkLabel, linkTo }: Props) {
	return (
		<p className="text-center text-sm text-muted">
			{prompt}{" "}
			<Link to={linkTo} className="font-medium text-accent hover:underline">
				{linkLabel}
			</Link>
		</p>
	);
}

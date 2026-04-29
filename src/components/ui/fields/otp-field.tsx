import { InputOTP, type InputOTPProps } from "@heroui/react";
import type { ComponentProps } from "react";

type Props = Omit<InputOTPProps, "children" | "maxLength"> & {
	errorText?: string;
	length?: number;
	containerProps?: ComponentProps<"div">;
};

export function OtpField({
	errorText,
	length = 6,
	containerProps,
	...props
}: Props) {
	const { className, ...restContainerProps } = containerProps ?? {};
	const slotKeys = Array.from({ length }, (_, index) => `otp-slot-${index}`);

	return (
		<div
			className={["flex flex-col items-center gap-1.5", className]
				.filter(Boolean)
				.join(" ")}
			{...restContainerProps}
		>
			<InputOTP maxLength={length} isInvalid={Boolean(errorText)} {...props}>
				<InputOTP.Group>
					{slotKeys.map((slotKey, index) => (
						<InputOTP.Slot key={slotKey} index={index} />
					))}
				</InputOTP.Group>
			</InputOTP>
			{errorText ? <p className="text-sm text-danger">{errorText}</p> : null}
		</div>
	);
}

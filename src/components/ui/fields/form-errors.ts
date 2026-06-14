type FieldLike = {
	state: {
		meta: {
			isTouched?: boolean;
			errors?: unknown[];
		};
	};
};

type FormLike = {
	state: {
		submissionAttempts?: number;
	};
};

export function getFieldError(field: FieldLike, form: FormLike) {
	const error = field.state.meta.errors?.[0];
	const message =
		typeof error === "string"
			? error
			: typeof error === "object" && error !== null && "message" in error
				? String(error.message)
				: undefined;
	const shouldShow =
		Boolean(field.state.meta.isTouched) ||
		Number(form.state.submissionAttempts ?? 0) > 0;

	return shouldShow ? message : undefined;
}

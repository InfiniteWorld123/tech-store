type FieldLike = {
	state: {
		meta: {
			isTouched?: boolean;
			errors?: { message?: string }[];
		};
	};
};

type FormLike = {
	state: {
		submissionAttempts?: number;
	};
};

export function getAdminFieldError(field: FieldLike, form: FormLike) {
	const message = field.state.meta.errors?.[0]?.message;
	const shouldShow =
		Boolean(field.state.meta.isTouched) ||
		Number(form.state.submissionAttempts ?? 0) > 0;

	return shouldShow ? message : undefined;
}

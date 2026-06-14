import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "./use-debounced-value";

type UseDebouncedSearchParamOptions = {
	committedValue: string | undefined;
	onCommit: (value: string | undefined) => void;
	delay?: number;
	normalize?: (value: string) => string;
};

const defaultNormalize = (value: string) => value.trim();

export function useDebouncedSearchParam({
	committedValue,
	onCommit,
	delay = 400,
	normalize = defaultNormalize,
}: UseDebouncedSearchParamOptions) {
	const committedInputValue = committedValue ?? "";
	const [inputValue, setInputValue] = useState(committedInputValue);
	const debouncedValue = useDebouncedValue(inputValue, delay);
	const lastCommittedInputValue = useRef(committedInputValue);

	const normalizeValue = useCallback(
		(value: string | undefined) => normalize(value ?? ""),
		[normalize],
	);

	useEffect(() => {
		if (lastCommittedInputValue.current !== committedInputValue) {
			lastCommittedInputValue.current = committedInputValue;
			setInputValue(committedInputValue);
		}
	}, [committedInputValue]);

	useEffect(() => {
		const nextValue = normalizeValue(debouncedValue);
		const currentValue = normalizeValue(committedInputValue);

		if (nextValue === currentValue) return;

		onCommit(nextValue || undefined);
	}, [committedInputValue, debouncedValue, normalizeValue, onCommit]);

	return useMemo(
		() => ({
			inputValue,
			setInputValue,
			debouncedValue,
			committedValue,
			isPending: normalizeValue(inputValue) !== normalizeValue(committedValue),
		}),
		[committedValue, debouncedValue, inputValue, normalizeValue],
	);
}

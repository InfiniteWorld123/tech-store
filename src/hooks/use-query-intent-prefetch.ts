import {
	type QueryClient,
	type QueryKey,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";

type PrefetchOptions = Parameters<QueryClient["prefetchQuery"]>[0] & {
	queryKey: QueryKey;
};

type PrefetchHandlers = {
	onFocus: () => void;
	onMouseEnter: () => void;
};

const keyToString = (queryKey: QueryKey) => JSON.stringify(queryKey);

export function useQueryIntentPrefetch() {
	const queryClient = useQueryClient();
	const inFlightKeys = useRef(new Set<string>());

	const prefetch = useCallback(
		(options: PrefetchOptions | undefined) => {
			if (!options) return;

			const cacheKey = keyToString(options.queryKey);
			if (inFlightKeys.current.has(cacheKey)) return;

			const queryState = queryClient.getQueryState(options.queryKey);
			if (queryState?.fetchStatus === "fetching") return;

			inFlightKeys.current.add(cacheKey);
			void queryClient
				.prefetchQuery(options)
				.finally(() => inFlightKeys.current.delete(cacheKey));
		},
		[queryClient],
	);

	const getPrefetchHandlers = useCallback(
		(options: PrefetchOptions | undefined): PrefetchHandlers => ({
			onFocus: () => prefetch(options),
			onMouseEnter: () => prefetch(options),
		}),
		[prefetch],
	);

	return { prefetch, getPrefetchHandlers };
}

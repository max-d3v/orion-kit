import {
  defaultShouldDehydrateQuery,
  type MutationCache,
  type QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { serializer } from "./lib/serializer";

type CreateQueryClientOptions = {
  /**
   * Cache instances carry the global side effects (error toasts, Sentry
   * logging). They are passed in from the client-side provider so the
   * server-side (RSC prefetch) client stays side-effect free.
   */
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
};

export function createQueryClient(options?: CreateQueryClientOptions) {
  return new QueryClient({
    queryCache: options?.queryCache,
    mutationCache: options?.mutationCache,
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey);
          return JSON.stringify({ json, meta });
        },
        staleTime: 60 * 1000, // > 0 to prevent immediate refetching on mount
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData(data) {
          const [json, meta] = serializer.serialize(data);
          return { json, meta };
        },
      },
      hydrate: {
        deserializeData(data) {
          return serializer.deserialize(data.json, data.meta);
        },
      },
    },
  });
}

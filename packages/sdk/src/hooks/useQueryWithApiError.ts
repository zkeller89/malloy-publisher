import {
   useQuery,
   useMutation,
   QueryClient,
   UseQueryOptions,
   UseQueryResult,
   UseMutationOptions,
   UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../components/ApiErrorDisplay";
import { useServer } from "../components";
import { RawAxiosRequestConfig } from "axios";

// Global QueryClient instance
const globalQueryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: false,
         throwOnError: false,
      },
      mutations: {
         retry: false,
         throwOnError: false,
      },
   },
});

export const getAxiosConfig = async (
   server: string,
   getAccessToken: () => Promise<string>,
): Promise<RawAxiosRequestConfig> => {
   const accessToken = getAccessToken ? await getAccessToken() : undefined;
   const headers = accessToken
      ? {
           Authorization: `Bearer ${accessToken}`,
        }
      : {};
   return {
      baseURL: server,
      withCredentials: !!accessToken,
      headers,
   } as RawAxiosRequestConfig;
};
export function useQueryWithApiError<TData = unknown, TError = ApiError>(
   options: Omit<UseQueryOptions<TData, TError>, "throwOnError" | "retry"> & {
      queryFn: (config: RawAxiosRequestConfig) => Promise<TData>;
   },
): UseQueryResult<TData, TError> {
   const { server, getAccessToken } = useServer();
   const enhancedOptions: UseQueryOptions<TData, TError> = {
      ...options,
      // Add in the server to the query key so that we can have a per-server caches.
      queryKey: [...options.queryKey, server],
      queryFn: async () => {
         try {
            const config = await getAxiosConfig(server, getAccessToken);
            return await options.queryFn(config);
         } catch (err) {
            // Standardized error handling for axios errors
            if (err && typeof err === "object" && "response" in err) {
               const axiosError = err as {
                  response?: {
                     status: number;
                     data: { code: number; message: string };
                  };
                  message: string;
               };
               if (axiosError.response?.data) {
                  const apiError: ApiError = new Error(
                     axiosError.response.data.message || axiosError.message,
                  );
                  apiError.status = axiosError.response.status;
                  apiError.data = axiosError.response.data;
                  throw apiError;
               }
            }
            // For other errors, throw as is
            throw err;
         }
      },
      retry: false,
      throwOnError: false,
   };

   return useQuery(enhancedOptions, globalQueryClient);
}

export function useMutationWithApiError<
   TData = unknown,
   TError = ApiError,
   TVariables = void,
>(
   options: Omit<
      UseMutationOptions<TData, TError, TVariables>,
      "throwOnError" | "retry" | "mutationFn"
   > & {
      mutationFn: (
         variables: TVariables,
         config: RawAxiosRequestConfig,
      ) => Promise<TData>;
   },
): UseMutationResult<TData, TError, TVariables> {
   const { server, getAccessToken } = useServer();
   const enhancedOptions: UseMutationOptions<TData, TError, TVariables> = {
      ...options,
      mutationFn: async (variables: TVariables) => {
         try {
            const config = await getAxiosConfig(server, getAccessToken);
            return await options.mutationFn(variables, config);
         } catch (err) {
            // Standardized error handling for axios errors
            if (err && typeof err === "object" && "response" in err) {
               const axiosError = err as {
                  response?: {
                     status: number;
                     data: { code: number; message: string };
                  };
                  message: string;
               };
               if (axiosError.response?.data) {
                  const apiError: ApiError = new Error(
                     axiosError.response.data.message || axiosError.message,
                  );
                  apiError.status = axiosError.response.status;
                  apiError.data = axiosError.response.data;
                  throw apiError;
               }
            }
            // For other errors, throw as is
            throw err;
         }
      },
      retry: false,
      throwOnError: false,
   };

   return useMutation(enhancedOptions, globalQueryClient);
}

// Export the global query client for direct access if needed
export { globalQueryClient };

import type { AsyncData } from "#app/composables/asyncData";
import { useRuntimeConfig } from "#imports";
import { FetchError } from "ofetch";
import type { SearchParameters } from "ofetch";

/**
 * This is the interface for the response of the useApi composable.
 * The keys are:
 * - data: the response data
 * - http_status: the HTTP status of the response
 * - success: whether the request was successful or not
 */
export interface ApiResponse {
    data: object | object[] | null;
    http_status: number;
    success: boolean;
}

/**
 * This is the interface for the options of the useApi composable.
 * The keys are:
 * - method: the HTTP method to use
 * - params: the search parameters to send with the request
 * - body: the request body
 * - tempToken: the temporary token to use for the request
 * - customHeader: the custom headers to add to the request
 * - watchVariables: the variables to watch for changes
 * - transform: the function to call with the response data
 * - credentials: the credentials to use for the request
 * - preventDeduplication: whether to prevent de-duplication of requests or not
 */
export interface ApiOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    params?: SearchParameters | Ref<SearchParameters | undefined>;
    body?: object | FormData | null;
    tempToken?: string;
    customHeader?: { 'Verification-Token'?: string; 'Content-Type'?: string };
    watchVariables?: boolean;
    transform?: () => void;
    credentials?: RequestCredentials | Ref<RequestCredentials | undefined> | undefined;
    preventDeduplication?: boolean; // this prevents de-duplication of requests
    immediateResponse?: boolean;
}

let useUniqueIdCounter = 0;
const useUniqueId = (prefix: string) => {
    useUniqueIdCounter += 1;
    return `${prefix}_${useUniqueIdCounter}`;
}

/**
 * This composable makes an HTTP request to the given path and returns the response as an AsyncData object.
 * If the request is successful, the response data is available in the `data` property of the AsyncData object.
 * If the request fails, the error is available in the `error` property of the AsyncData object.
 * You can also pass a `transform` function to the options to transform the response data.
 * The `watchVariables` option allows you to specify variables that should trigger a re-fetch of the API.
 * The `preventDeduplication` option allows you to prevent de-duplication of requests.
 * @param path the path to make the request to
 * @param options the options to pass to the request
 * @returns an AsyncData object with the response data or an error
 */
export const useApi = <T>(
  path: string,
  {
    method,
    params,
    body,
    credentials,
    tempToken,
    customHeader = {},
    watchVariables = false,
    preventDeduplication = false,
    immediateResponse = true,
  }: ApiOptions
): AsyncData<ApiResponse, FetchError<object | null> | null> => {
  const config = useRuntimeConfig();
  const cookies = useCookie('accessToken');

  return useFetch(path, {
    method,
    baseURL: config.public.apiBase,
    body,
    params,
    key: preventDeduplication ? useUniqueId('useApi_') : undefined,
    credentials,
    async onRequest({ request, options }) {
      if (cookies.value || tempToken) {
        options.headers = options.headers instanceof Headers ? options.headers : new Headers(customHeader);
        options.headers.set('Authorization', `Bearer ${cookies.value || tempToken}`)
      }

      // accept json header
      options.headers = options.headers instanceof Headers ? options.headers : new Headers(customHeader);
      options.headers.set('Content-Type', 'application/json');
      options.headers.set('Accept', 'application/json');
    },
    watch: watchVariables,
    immediate: immediateResponse,
  }) as AsyncData<ApiResponse, FetchError<object | null> | null>;
};

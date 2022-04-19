// borrowed from: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

interface ErrorResponse {
  status: number,
  data: { error: string }
}

const isErrorResponse = (maybeErrorResponse: unknown): maybeErrorResponse is ErrorResponse => (
  typeof maybeErrorResponse === 'object'
    && maybeErrorResponse !== null
    && 'status' in maybeErrorResponse
    && typeof (maybeErrorResponse as Record<string, unknown>).status === 'number'
    && 'data' in maybeErrorResponse
    && typeof (maybeErrorResponse as Record<string, unknown>).data === 'object'
    && 'error' in (maybeErrorResponse as any).data
    && typeof (maybeErrorResponse as any).data.error === 'string'
);

interface ErrorWithMessage {
  message: string
}

const isErrorWithMessage = (maybeError: unknown): maybeError is ErrorWithMessage => (
  typeof maybeError === 'object'
    && maybeError !== null
    && 'message' in maybeError
    && typeof (maybeError as Record<string, unknown>).message === 'string'
);

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorResponse(maybeError)) return new Error(maybeError.data.error);
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

const getErrorMessage = (maybeError: unknown) => toErrorWithMessage(maybeError).message;

export default getErrorMessage;

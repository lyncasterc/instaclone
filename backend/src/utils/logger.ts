const info = (...params: any[]) => {
  console.log(...params);
};

const error = (...params: unknown[]) => {
  console.error(...params);
};

// borrowed from: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

type ErrorWithMessage = {
  message: string
};

const isErrorWithMessage = (maybeError: unknown): maybeError is ErrorWithMessage => (
  typeof maybeError === 'object'
    && maybeError !== null
    && 'message' in maybeError
    && typeof (maybeError as Record<string, unknown>).message === 'string'
);

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

const getErrorMessage = (maybeError: unknown) => toErrorWithMessage(maybeError).message;

export default {
  info,
  error,
  getErrorMessage,
};

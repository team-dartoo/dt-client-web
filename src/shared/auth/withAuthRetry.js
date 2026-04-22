export const createAuthRetryRunner = ({ refresh, onAuthFailure }) => {
  return async (requestFn) => {
    try {
      return await requestFn();
    } catch (err) {
      if (err.status !== 401) {
        throw err;
      }

      try {
        await refresh();
      } catch {
        await onAuthFailure();
        throw err;
      }

      try {
        return await requestFn();
      } catch (retryErr) {
        if (retryErr.status === 401) {
          await onAuthFailure();
        }
        throw retryErr;
      }
    }
  };
};

const SESSION_CAP_MINUTES = 10;

export const isSessionExpired = (startedAt: Date): boolean => {
  const elapsedMs = Date.now() - startedAt.getTime();
  return elapsedMs >= SESSION_CAP_MINUTES * 60 * 1000;
};

export const getSessionRemainingSeconds = (startedAt: Date): number => {
  const elapsedMs = Date.now() - startedAt.getTime();
  const remainingMs = SESSION_CAP_MINUTES * 60 * 1000 - elapsedMs;
  return Math.max(0, Math.floor(remainingMs / 1000));
};
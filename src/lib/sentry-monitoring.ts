import * as Sentry from "@sentry/nextjs";

export async function withMonitoredServerAction<T>(
  actionName: string,
  fn: () => Promise<T>,
): Promise<T> {
  return Sentry.startSpan(
    {
      op: "server.action",
      name: actionName,
    },
    async () => {
      try {
        return await fn();
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setTag("monitoring.type", "server-action");
          scope.setTag("action.name", actionName);
          scope.setLevel("error");
          Sentry.captureException(error);
        });
        throw error;
      }
    },
  );
}

export function captureApiRouteError(
  error: unknown,
  context: {
    method: string;
    route: string;
    metadata?: Record<string, unknown>;
  },
) {
  Sentry.withScope((scope) => {
    scope.setTag("monitoring.type", "api-route");
    scope.setTag("http.method", context.method);
    scope.setTag("http.route", context.route);
    if (context.metadata) {
      Object.entries(context.metadata).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    scope.setLevel("error");
    Sentry.captureException(error);
  });
}


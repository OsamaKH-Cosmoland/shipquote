import * as Sentry from "@sentry/node";

// Initialize Sentry as early as possible. This module is imported *first* from
// the entrypoints (api/index.ts for serverless, server.ts for local), before
// Express and the rest of the app load, so error reporting is active from the
// very start.
//
// The DSN is read from the SENTRY_DSN environment variable (never hardcoded).
// When SENTRY_DSN is unset — e.g. local dev without Sentry configured — the SDK
// initializes as a no-op, so captureException()/flush() do nothing and nothing
// breaks.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Error monitoring only; we are not sampling performance traces here.
  tracesSampleRate: 0,
});

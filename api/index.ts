import "dotenv/config";
import "../src/instrument";
import * as Sentry from "@sentry/node";
import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app";

// Serverless entry for the API. The React frontend is served as static files
// (client/dist); vercel.json routes only /api/* to this function.
//
// A Vercel serverless function can freeze or be torn down the instant it sends
// its response — which can cut off Sentry's asynchronous event delivery before
// the error actually leaves the process. So we run the Express app, wait for
// the response to finish, and then flush Sentry's queue before the handler
// resolves. Vercel keeps the function alive until the returned promise settles,
// so the flush is guaranteed to complete before shutdown.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await new Promise<void>((resolve) => {
      res.once("finish", () => resolve());
      res.once("close", () => resolve());
      app(req, res);
    });
  } finally {
    // Wait up to 2s for buffered Sentry events to be sent.
    await Sentry.flush(2000);
  }
}

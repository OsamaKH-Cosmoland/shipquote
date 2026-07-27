import * as Sentry from "@sentry/node";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { connectDB } from "./config/db";
import { healthRouter } from "./routes/health";
import { quotesRouter } from "./routes/quotes";

export const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Establish (and cache) the database connection as part of the request
// lifecycle rather than at server startup, so the same app works in a
// serverless environment where there is no long-lived startup phase.
// connectDB() never throws, so a DB outage degrades the route to a 500
// instead of taking the process down. /health deliberately skips this.
async function ensureDbConnected(_req: Request, _res: Response, next: NextFunction) {
  await connectDB();
  next();
}

// API routes are namespaced under /api so a single deployment can serve the
// static frontend at / and the API under /api/* (see vercel.json).
app.use("/api/health", healthRouter);
app.use("/api/quotes", ensureDbConnected, quotesRouter);

// TEMPORARY: throws on purpose so we can confirm Sentry is receiving errors.
// Hit GET /api/debug-sentry, then check your Sentry dashboard for the event.
// Remove this route once Sentry is verified.
app.get("/api/debug-sentry", () => {
  throw new Error("Sentry test error: /api/debug-sentry");
});

// Report every error that reaches this handler to Sentry before responding.
// Express 5 forwards both thrown and rejected errors from routes here.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  Sentry.captureException(err);
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Served as a serverless function via api/index.ts.
export default app;

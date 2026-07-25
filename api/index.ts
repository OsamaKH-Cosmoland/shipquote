import "dotenv/config";
import { app } from "../src/app";

// Vercel's Node runtime invokes the default export as (req, res). An Express
// app is exactly such a handler, so we hand the whole app to the platform.
// The DB connection is opened per-request (and cached) inside the app itself.
export default app;

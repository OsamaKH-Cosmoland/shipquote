import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app";

// Vercel's Node runtime requires the default export to be a plain request
// handler it can call as (req, res). Exporting the Express `app` instance
// directly is rejected by @vercel/node's export validation with
// "Invalid export found in module ...", so we wrap it. The Express app is
// itself a valid Node request listener, so this thin handler just forwards
// the request to it. The DB connection is opened per-request (and cached)
// inside the app itself.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}

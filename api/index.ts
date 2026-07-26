import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app";

// Serverless entry for the API. The React frontend is served as static files
// (client/dist); vercel.json routes only /api/* to this function, and the
// Express app defines its routes under /api/*.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}

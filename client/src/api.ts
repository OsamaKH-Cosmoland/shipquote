import type { Quote } from "./types";

// The frontend and API share one origin: API calls go to /api/* and are
// proxied to the backend by Vercel in production (client/vercel.json) and by
// the Vite dev server locally (vite.config.ts). No cross-origin requests, so
// no CORS, and no build-time backend URL to configure.
const API_BASE_URL = "/api";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // response body wasn't JSON
  }
  return `Request failed with status ${res.status}`;
}

export async function getQuotes(): Promise<Quote[]> {
  const res = await fetch(`${API_BASE_URL}/quotes`);
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

export async function createQuote(input: {
  destination: string;
  weightKg: number;
}): Promise<Quote> {
  const res = await fetch(`${API_BASE_URL}/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

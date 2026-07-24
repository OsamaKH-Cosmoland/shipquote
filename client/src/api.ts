import type { Quote } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_URL is not set. Create client/.env with VITE_API_URL=<backend URL>."
    );
  }
  return API_BASE_URL;
}

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
  const res = await fetch(`${requireApiBaseUrl()}/quotes`);
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

export async function createQuote(input: {
  destination: string;
  weightKg: number;
}): Promise<Quote> {
  const res = await fetch(`${requireApiBaseUrl()}/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

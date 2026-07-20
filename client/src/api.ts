import type { Quote } from "./types";

const API_BASE_URL = "http://localhost:3000";

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

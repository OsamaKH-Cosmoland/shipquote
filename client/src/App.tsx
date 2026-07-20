import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createQuote, getQuotes } from "./api";
import type { Destination, Quote } from "./types";
import "./App.css";

const MAX_QUOTES_SHOWN = 20;

function App() {
  const [destination, setDestination] = useState<Destination>("domestic");
  const [weightKg, setWeightKg] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getQuotes()
      .then(setQuotes)
      .catch((err: Error) => setQuotesError(err.message))
      .finally(() => setQuotesLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const weight = Number(weightKg);
    if (weightKg.trim() === "" || Number.isNaN(weight) || weight < 0) {
      setSubmitError("Enter a non-negative weight in kg.");
      return;
    }

    setSubmitting(true);
    try {
      const quote = await createQuote({ destination, weightKg: weight });
      setQuotes((prev) => [quote, ...prev].slice(0, MAX_QUOTES_SHOWN));
      setWeightKg("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create quote.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>ShipQuote</h1>

      <form onSubmit={handleSubmit} className="quote-form" noValidate>
        <label htmlFor="destination">Destination</label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value as Destination)}
        >
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
        </select>

        <label htmlFor="weightKg">Weight (kg)</label>
        <input
          id="weightKg"
          type="number"
          min="0"
          step="any"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Getting quote..." : "Get quote"}
        </button>

        {submitError && <p className="error">{submitError}</p>}
      </form>

      <section>
        <h2>Past quotes</h2>

        {quotesLoading && <p>Loading quotes...</p>}
        {quotesError && <p className="error">{quotesError}</p>}

        {!quotesLoading && !quotesError && quotes.length === 0 && (
          <p className="muted">No quotes yet.</p>
        )}

        {quotes.length > 0 && (
          <ul className="quote-list">
            {quotes.map((quote) => (
              <li key={quote._id}>
                <span className="destination">{quote.destination}</span>
                <span className="weight">{quote.weightKg} kg</span>
                <span className="cost">${quote.cost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;

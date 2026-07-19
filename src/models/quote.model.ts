import { Schema, model } from "mongoose";

export interface QuoteAttrs {
  destination: string;
  weightKg: number;
  cost: number;
}

const quoteSchema = new Schema<QuoteAttrs>(
  {
    destination: { type: String, required: true },
    weightKg: { type: Number, required: true },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Quote = model<QuoteAttrs>("Quote", quoteSchema);

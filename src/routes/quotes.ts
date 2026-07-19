import { Router, Request, Response } from "express";
import { Quote } from "../models/quote.model";
import { calculateShippingCost } from "../services/pricing";

export const quotesRouter = Router();

quotesRouter.post("/", async (req: Request, res: Response) => {
  const { destination, weightKg } = req.body ?? {};

  if (typeof destination !== "string" || destination.trim() === "") {
    res.status(400).json({ error: "destination is required and must be a non-empty string" });
    return;
  }

  if (typeof weightKg !== "number" || Number.isNaN(weightKg)) {
    res.status(400).json({ error: "weightKg is required and must be a number" });
    return;
  }

  if (weightKg < 0) {
    res.status(400).json({ error: "weightKg must not be negative" });
    return;
  }

  const cost = calculateShippingCost(destination, weightKg);
  const quote = await Quote.create({ destination, weightKg, cost });

  res.status(201).json(quote);
});

quotesRouter.get("/", async (_req: Request, res: Response) => {
  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(20);
  res.json(quotes);
});

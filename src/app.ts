import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { healthRouter } from "./routes/health";
import { quotesRouter } from "./routes/quotes";

export const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/quotes", quotesRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

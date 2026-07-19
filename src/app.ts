import express from "express";
import { healthRouter } from "./routes/health";

export const app = express();

app.use("/health", healthRouter);

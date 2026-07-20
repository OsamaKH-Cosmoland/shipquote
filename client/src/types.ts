export type Destination = "domestic" | "international";

export interface Quote {
  _id: string;
  destination: string;
  weightKg: number;
  cost: number;
}

export type LegKind = "lambert" | "assist" | "aerocapture" | "depot";

export type Leg = {
  from: string;
  to: string;
  departMjd: number;
  arriveMjd: number;
  kind: LegKind;
  assistBody?: string;
  shipDv: number;
  aeroCredit: number;
  waitDays: number;
};

export type Itinerary = {
  origin: string;
  dest: string;
  readyMjd: number;
  fuel0: number;
  fuel1: number;
  legs: Leg[];
  flightDays: number;
  waitDays: number;
  shipDv: number;
  properDays: number;
  stranded: boolean;
  source: "baseline" | "student";
};

export type RideQuery = {
  from: string;
  to: string;
  readyIso: string;
  fuel?: number;
};

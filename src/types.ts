export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
}

export interface Appointment {
  id: string;
  userId: string;
  userName?: string;
  carModel: string;
  filmType: string;
  filmPercentage: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  appointment_date: string;
  appointment_time: string;
  observations?: string;
  created_at: string;
}

export type FilmTypeKey = "economica" | "premium" | "termica" | "antivandalismo";

export interface FilmDetails {
  name: string;
  description: string;
  uvRejection: string;
  heatReduction: string;
  warranty: string;
  priceEstimate: string;
}

/**
 * Types pour l'application FEFFS
 */

export interface Film {
  id: string;
  title: string;
  originalTitle?: string;
  director: string;
  year: number;
  duration: number; // en minutes
  genre: string[];
  country: string;
  synopsis: string;
  posterUrl: string;
  trailerUrl?: string;
}

export interface Projection {
  id: string;
  filmId: string;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  venue: Venue;
  ticketsAvailable: boolean;
  price?: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  capacity?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "conference" | "atelier" | "masterclass" | "autre";
  date: Date;
  startTime: string;
  endTime: string;
  venue: Venue;
  speakers?: string[];
  isFree: boolean;
}

export interface UserPass {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUri: string;
  qrCodeUri: string;
  passType: "journée" | "weekend" | "semaine";
  createdAt: Date;
  validUntil: Date;
}

export interface UserSchedule {
  projections: Projection[];
  events: Event[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  qrCode: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: "text" | "rating" | "multiple-choice" | "yes-no";
  required: boolean;
  options?: string[]; // Pour multiple-choice
  min?: number; // Pour rating
  max?: number; // Pour rating
}

export interface SurveyResponse {
  surveyId: string;
  questionId: string;
  answer: string | number;
}

export interface CompletedSurvey {
  id: string;
  surveyId: string;
  surveyTitle: string;
  responses: SurveyResponse[];
  completedAt: Date;
}

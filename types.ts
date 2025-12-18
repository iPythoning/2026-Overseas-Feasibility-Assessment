export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  type?: 'single' | 'multiple';
  maxScore?: number; // For multi-select capping
}

export interface Dimension {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface ResultCategory {
  min: number;
  max: number;
  title: string;
  stars: number; // 1 to 5
  description: string;
  priority: string; // The "Priority Action" or "Characteristics"
  advice: string[];
  outcome: string;
}

export interface SavedAssessment {
  id: string;
  date: string;
  totalScore: number;
  categoryTitle: string;
  dimensionScores: Record<string, number>;
}

export interface ContactSubmission {
  id: string;
  date: string;
  name: string;
  phone: string;
  company: string;
  score: number;
  categoryTitle: string;
}

// Map of Question ID to Array of Selected Option Indices
export type AnswersMap = Record<number, number[]>;
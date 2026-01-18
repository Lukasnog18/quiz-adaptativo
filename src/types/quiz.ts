// Quiz Types - Core domain types
import React from 'react';
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic = 
  | 'programming' 
  | 'history' 
  | 'mathematics' 
  | 'general_knowledge'
  | 'science'
  | 'geography';

export interface TopicInfo {
  id: Topic;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  explanation: string;
  difficulty: Difficulty;
  topic: Topic;
}

export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  difficulty: Difficulty;
}

export interface QuizSession {
  id: string;
  topic: Topic;
  startedAt: Date;
  endedAt?: Date;
  initialDifficulty: Difficulty;
  currentDifficulty: Difficulty;
  answers: QuestionAnswer[];
  totalQuestions: number;
}

export interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTimePerQuestion: number;
  accuracy: number;
  difficultyProgression: Difficulty[];
  topic: Topic;
  duration: number; // in seconds
}

export interface QuizState {
  status: 'idle' | 'selecting' | 'playing' | 'answered' | 'loading' | 'finished' | 'error';
  session: QuizSession | null;
  currentQuestion: Question | null;
  selectedOptionId: string | null;
  questionStartTime: number | null;
  error: string | null;
}

import { supabase } from '@/integrations/supabase/client';
import { Question, Topic, Difficulty, QuizSession, QuestionAnswer } from '@/types/quiz';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Create a new quiz session
export const createQuizSession = (
  topic: Topic,
  difficulty: Difficulty,
  totalQuestions: number = 10
): QuizSession => {
  return {
    id: generateId(),
    topic,
    startedAt: new Date(),
    initialDifficulty: difficulty,
    currentDifficulty: difficulty,
    answers: [],
    totalQuestions,
  };
};

// Adapt difficulty based on recent performance
export const adaptDifficulty = (
  answers: QuestionAnswer[],
  currentDifficulty: Difficulty
): Difficulty => {
  const recentAnswers = answers.slice(-3);
  
  if (recentAnswers.length < 3) {
    return currentDifficulty;
  }

  const correctCount = recentAnswers.filter((a) => a.isCorrect).length;

  if (correctCount === 3 && currentDifficulty !== 'hard') {
    return currentDifficulty === 'easy' ? 'medium' : 'hard';
  }

  if (correctCount <= 1 && currentDifficulty !== 'easy') {
    return currentDifficulty === 'hard' ? 'medium' : 'easy';
  }

  return currentDifficulty;
};

// Generate a question using AI
export const generateQuestion = async (
  topic: Topic,
  difficulty: Difficulty,
  previousQuestions: string[] = []
): Promise<Question> => {
  const { data, error } = await supabase.functions.invoke('generate-question', {
    body: {
      topic,
      difficulty,
      previousQuestions,
    },
  });

  if (error) {
    console.error('Error generating question:', error);
    throw new Error('Falha ao gerar pergunta. Tente novamente.');
  }

  if (!data || !data.question) {
    throw new Error('Resposta inválida da IA. Tente novamente.');
  }

  return {
    ...data.question,
    id: generateId(),
    topic,
    difficulty,
  };
};

// Calculate quiz summary
export const calculateSummary = (session: QuizSession) => {
  const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
  const totalTime = session.answers.reduce((sum, a) => sum + a.timeSpent, 0);
  
  return {
    totalQuestions: session.answers.length,
    correctAnswers,
    wrongAnswers: session.answers.length - correctAnswers,
    averageTimePerQuestion: session.answers.length > 0 
      ? Math.round(totalTime / session.answers.length) 
      : 0,
    accuracy: session.answers.length > 0 
      ? Math.round((correctAnswers / session.answers.length) * 100) 
      : 0,
    difficultyProgression: session.answers.map((a) => a.difficulty),
    topic: session.topic,
    duration: totalTime,
  };
};

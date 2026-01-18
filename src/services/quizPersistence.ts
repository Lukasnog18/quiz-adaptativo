import { supabase } from '@/integrations/supabase/client';
import { Topic, Difficulty } from '@/types/quiz';

// Create a new quiz session in the database
export const createDbSession = async (
  userId: string,
  topic: Topic,
  difficulty: Difficulty,
  totalQuestions: number
): Promise<string> => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: userId,
      topic,
      initial_level: difficulty,
      total_questions: totalQuestions,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw new Error('Falha ao criar sessão no banco de dados.');
  }

  return data.id;
};

// Record an answer in the database
export const recordAnswer = async (
  sessionId: string,
  question: string,
  selectedAnswer: string,
  correctAnswer: string,
  isCorrect: boolean
): Promise<void> => {
  const { error } = await supabase
    .from('quiz_answers')
    .insert({
      session_id: sessionId,
      question,
      selected_answer: selectedAnswer,
      correct_answer: correctAnswer,
      is_correct: isCorrect,
    });

  if (error) {
    console.error('Error recording answer:', error);
    throw new Error('Falha ao registrar resposta.');
  }
};

// Update session statistics
export const updateSessionStats = async (
  sessionId: string,
  totalQuestions: number,
  correctAnswers: number
): Promise<void> => {
  const { error } = await supabase
    .from('quiz_sessions')
    .update({
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session stats:', error);
  }
};

// Finish a quiz session
export const finishSession = async (
  sessionId: string,
  totalQuestions: number,
  correctAnswers: number
): Promise<void> => {
  const { error } = await supabase
    .from('quiz_sessions')
    .update({
      finished_at: new Date().toISOString(),
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error finishing session:', error);
    throw new Error('Falha ao finalizar sessão.');
  }
};

// Get user's quiz sessions
export const getUserSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw new Error('Falha ao carregar histórico.');
  }

  return data;
};

// Get answers for a specific session
export const getSessionAnswers = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('quiz_answers')
    .select('*')
    .eq('session_id', sessionId)
    .order('answered_at', { ascending: true });

  if (error) {
    console.error('Error fetching answers:', error);
    throw new Error('Falha ao carregar respostas.');
  }

  return data;
};

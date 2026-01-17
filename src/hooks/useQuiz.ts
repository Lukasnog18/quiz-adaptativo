import { useState, useCallback } from 'react';
import { QuizState, Topic, Difficulty, QuestionAnswer } from '@/types/quiz';
import { 
  createQuizSession, 
  generateQuestion, 
  adaptDifficulty, 
  calculateSummary 
} from '@/services/quizService';

const INITIAL_STATE: QuizState = {
  status: 'idle',
  session: null,
  currentQuestion: null,
  selectedOptionId: null,
  questionStartTime: null,
  error: null,
};

export const useQuiz = () => {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);

  const startQuiz = useCallback(async (topic: Topic, difficulty: Difficulty) => {
    setState((prev) => ({
      ...prev,
      status: 'loading',
      error: null,
    }));

    try {
      const session = createQuizSession(topic, difficulty);
      
      const question = await generateQuestion(topic, difficulty);

      setState({
        status: 'playing',
        session,
        currentQuestion: question,
        selectedOptionId: null,
        questionStartTime: Date.now(),
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro ao iniciar quiz',
      }));
    }
  }, []);

  const selectOption = useCallback((optionId: string) => {
    if (state.status !== 'playing') return;

    setState((prev) => ({
      ...prev,
      selectedOptionId: optionId,
    }));
  }, [state.status]);

  const confirmAnswer = useCallback(async () => {
    if (
      state.status !== 'playing' ||
      !state.selectedOptionId ||
      !state.currentQuestion ||
      !state.session ||
      !state.questionStartTime
    ) {
      return;
    }

    const selectedOption = state.currentQuestion.options.find(
      (o) => o.id === state.selectedOptionId
    );

    if (!selectedOption) return;

    const timeSpent = Math.round((Date.now() - state.questionStartTime) / 1000);

    const answer: QuestionAnswer = {
      questionId: state.currentQuestion.id,
      selectedOptionId: state.selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      timeSpent,
      difficulty: state.session.currentDifficulty,
    };

    const updatedAnswers = [...state.session.answers, answer];
    
    setState((prev) => ({
      ...prev,
      status: 'answered',
      session: prev.session
        ? {
            ...prev.session,
            answers: updatedAnswers,
          }
        : null,
    }));
  }, [state]);

  const nextQuestion = useCallback(async () => {
    if (state.status !== 'answered' || !state.session) return;

    // Check if quiz is finished
    if (state.session.answers.length >= state.session.totalQuestions) {
      setState((prev) => ({
        ...prev,
        status: 'finished',
        session: prev.session
          ? {
              ...prev.session,
              endedAt: new Date(),
            }
          : null,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      status: 'loading',
    }));

    try {
      // Adapt difficulty based on performance
      const newDifficulty = adaptDifficulty(
        state.session.answers,
        state.session.currentDifficulty
      );

      // Get previous questions to avoid repetition
      const previousQuestions = state.session.answers.map((a) => {
        // We'd need to store question texts, for now just pass IDs
        return a.questionId;
      });

      const question = await generateQuestion(
        state.session.topic,
        newDifficulty,
        previousQuestions
      );

      setState((prev) => ({
        ...prev,
        status: 'playing',
        currentQuestion: question,
        selectedOptionId: null,
        questionStartTime: Date.now(),
        session: prev.session
          ? {
              ...prev.session,
              currentDifficulty: newDifficulty,
            }
          : null,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro ao carregar próxima pergunta',
      }));
    }
  }, [state]);

  const getSummary = useCallback(() => {
    if (!state.session) return null;
    return calculateSummary(state.session);
  }, [state.session]);

  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const retryOnError = useCallback(() => {
    if (state.session && state.status === 'error') {
      // Retry generating a question
      setState((prev) => ({
        ...prev,
        status: 'loading',
        error: null,
      }));

      generateQuestion(
        state.session.topic,
        state.session.currentDifficulty
      )
        .then((question) => {
          setState((prev) => ({
            ...prev,
            status: 'playing',
            currentQuestion: question,
            selectedOptionId: null,
            questionStartTime: Date.now(),
            error: null,
          }));
        })
        .catch((error) => {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro ao tentar novamente',
          }));
        });
    }
  }, [state.session, state.status]);

  return {
    state,
    startQuiz,
    selectOption,
    confirmAnswer,
    nextQuestion,
    getSummary,
    resetQuiz,
    retryOnError,
  };
};

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { WelcomeScreen } from './WelcomeScreen';
import { TopicSelector } from './TopicSelector';
import { QuizProgress } from './QuizProgress';
import { QuestionCard } from './QuestionCard';
import { QuizSummary } from './QuizSummary';
import { LoadingQuestion } from './LoadingQuestion';
import { ErrorState } from './ErrorState';

type Screen = 'welcome' | 'topic-selector';

export const QuizContainer = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const {
    state,
    startQuiz,
    selectOption,
    confirmAnswer,
    nextQuestion,
    getSummary,
    resetQuiz,
    retryOnError,
  } = useQuiz();

  const handleStartFromWelcome = () => {
    setScreen('topic-selector');
  };

  const handleResetQuiz = () => {
    resetQuiz();
    setScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* Welcome screen */}
          {state.status === 'idle' && screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WelcomeScreen onStart={handleStartFromWelcome} />
            </motion.div>
          )}

          {/* Topic selection screen */}
          {state.status === 'idle' && screen === 'topic-selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TopicSelector onStart={startQuiz} onBack={() => setScreen('welcome')} />
            </motion.div>
          )}

          {/* Loading state (initial) */}
          {state.status === 'loading' && !state.session && (
            <motion.div
              key="loading-initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <LoadingQuestion />
            </motion.div>
          )}

          {/* Quiz playing screen */}
          {(state.status === 'playing' || state.status === 'answered' || 
            (state.status === 'loading' && state.session)) && state.session && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col py-8"
            >
              {/* Progress header */}
              <div className="mb-8">
                <QuizProgress session={state.session} />
              </div>

              {/* Question area */}
              <div className="flex-1 flex items-center justify-center">
                {state.status === 'loading' ? (
                  <LoadingQuestion />
                ) : state.currentQuestion ? (
                  <QuestionCard
                    question={state.currentQuestion}
                    selectedOptionId={state.selectedOptionId}
                    isAnswered={state.status === 'answered'}
                    onSelectOption={selectOption}
                    onConfirm={confirmAnswer}
                    onNext={nextQuestion}
                  />
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {state.status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <ErrorState
                message={state.error || 'Erro desconhecido'}
                onRetry={state.session ? retryOnError : undefined}
                onGoHome={handleResetQuiz}
              />
            </motion.div>
          )}

          {/* Summary screen */}
          {state.status === 'finished' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {getSummary() && (
                <QuizSummary summary={getSummary()!} onRestart={handleResetQuiz} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

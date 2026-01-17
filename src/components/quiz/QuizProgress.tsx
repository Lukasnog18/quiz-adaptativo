import { motion } from 'framer-motion';
import { QuizSession } from '@/types/quiz';
import { DIFFICULTY_LABELS, getTopicById } from '@/config/topics';
import { CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface QuizProgressProps {
  session: QuizSession;
}

export const QuizProgress = ({ session }: QuizProgressProps) => {
  const topic = getTopicById(session.topic);
  const currentQuestion = session.answers.length + 1;
  const progress = (session.answers.length / session.totalQuestions) * 100;
  const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
  const wrongAnswers = session.answers.length - correctAnswers;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Progress bar */}
      <div className="relative h-2 bg-progress-bg rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute inset-y-0 left-0 progress-fill rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Question counter */}
          <span className="text-muted-foreground">
            <span className="text-foreground font-semibold">{currentQuestion}</span>
            /{session.totalQuestions}
          </span>

          {/* Topic */}
          {topic && (
            <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
              <span>{topic.icon}</span>
              <span>{topic.name}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Correct/Wrong counters */}
          <div className="flex items-center gap-1 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">{correctAnswers}</span>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <XCircle className="w-4 h-4" />
            <span className="font-semibold">{wrongAnswers}</span>
          </div>

          {/* Current difficulty */}
          <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              {DIFFICULTY_LABELS[session.currentDifficulty]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

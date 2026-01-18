import { motion } from 'framer-motion';
import { QuizSummary as QuizSummaryType } from '@/types/quiz';
import { getTopicById, DIFFICULTY_LABELS } from '@/config/topics';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  RotateCcw,
  Star,
  Zap
} from 'lucide-react';

interface QuizSummaryProps {
  summary: QuizSummaryType;
  onRestart: () => void;
}

export const QuizSummary = ({ summary, onRestart }: QuizSummaryProps) => {
  const topic = getTopicById(summary.topic);
  
  const getPerformanceMessage = () => {
    if (summary.accuracy >= 90) return { text: 'Excelente!', emoji: '🏆', color: 'text-success' };
    if (summary.accuracy >= 70) return { text: 'Muito Bem!', emoji: '⭐', color: 'text-primary' };
    if (summary.accuracy >= 50) return { text: 'Bom Trabalho!', emoji: '👍', color: 'text-amber-400' };
    return { text: 'Continue Praticando!', emoji: '💪', color: 'text-muted-foreground' };
  };

  const performance = getPerformanceMessage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Get final difficulty (most common in the last half)
  const lastHalfDifficulties = summary.difficultyProgression.slice(
    Math.floor(summary.difficultyProgression.length / 2)
  );
  const difficultyCount = lastHalfDifficulties.reduce((acc, d) => {
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const finalDifficulty = Object.entries(difficultyCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || summary.difficultyProgression[summary.difficultyProgression.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Confetti effect for good performance */}
      {summary.accuracy >= 70 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'linear',
              }}
              className={`
                absolute w-3 h-3 rounded-sm
                ${['bg-primary', 'bg-success', 'bg-cyan-400', 'bg-amber-400'][i % 4]}
              `}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block text-6xl sm:text-8xl mb-4"
          >
            {performance.emoji}
          </motion.div>
          <h1 className={`text-3xl sm:text-5xl font-display font-bold mb-2 ${performance.color}`}>
            {performance.text}
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            {topic && <topic.icon className="w-5 h-5" style={{ color: topic.color }} />}
            <span>{topic?.name}</span>
          </p>
        </div>

        {/* Main score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 p-8 rounded-2xl bg-card/50 border border-border glow-primary"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-5xl sm:text-7xl font-display font-bold text-gradient">
              {summary.accuracy}%
            </span>
          </div>
          <p className="text-muted-foreground">Taxa de Acerto</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <Target className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{summary.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Acertos</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <Zap className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{summary.wrongAnswers}</p>
            <p className="text-xs text-muted-foreground">Erros</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">
              {formatTime(summary.averageTimePerQuestion)}
            </p>
            <p className="text-xs text-muted-foreground">Tempo Médio</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
            <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">
              {DIFFICULTY_LABELS[finalDifficulty]}
            </p>
            <p className="text-xs text-muted-foreground">Nível Final</p>
          </div>
        </motion.div>

        {/* Performance stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            >
              <Star
                className={`w-8 h-8 ${
                  i < Math.round(summary.accuracy / 20)
                    ? 'text-success fill-success'
                    : 'text-muted'
                }`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={onRestart}
            className="
              px-8 py-6 text-lg font-display font-semibold
              bg-gradient-to-r from-primary to-cyan-400
              hover:from-primary/90 hover:to-cyan-400/90
              glow-primary transition-all duration-300
            "
          >
            <RotateCcw className="mr-2 w-5 h-5" />
            Novo Quiz
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

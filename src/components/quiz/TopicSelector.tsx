import { useState } from 'react';
import { motion } from 'framer-motion';
import { Topic, Difficulty } from '@/types/quiz';
import { TOPICS, DIFFICULTY_LABELS } from '@/config/topics';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Brain, Flame } from 'lucide-react';

interface TopicSelectorProps {
  onStart: (topic: Topic, difficulty: Difficulty) => void;
  isLoading?: boolean;
}

const difficultyIcons = {
  easy: Zap,
  medium: Brain,
  hard: Flame,
};

const difficultyColors = {
  easy: 'border-green-500/50 bg-green-500/10 text-green-400 hover:border-green-400',
  medium: 'border-amber-500/50 bg-amber-500/10 text-amber-400 hover:border-amber-400',
  hard: 'border-red-500/50 bg-red-500/10 text-red-400 hover:border-red-400',
};

export const TopicSelector = ({ onStart, isLoading }: TopicSelectorProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleStart = () => {
    if (selectedTopic && selectedDifficulty) {
      onStart(selectedTopic, selectedDifficulty);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-gradient mb-4">
          Quiz Inteligente
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
          Teste seus conhecimentos com perguntas adaptativas geradas por IA
        </p>
      </motion.div>

      {/* Topic Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-4xl mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-center mb-6">
          Escolha o tema
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {TOPICS.map((topic, index) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setSelectedTopic(topic.id)}
              className={`
                relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300
                ${
                  selectedTopic === topic.id
                    ? 'border-primary bg-primary/10 glow-primary'
                    : 'border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card'
                }
              `}
            >
              <span className="text-3xl sm:text-4xl mb-2 block">{topic.icon}</span>
              <h3 className="font-display font-semibold text-sm sm:text-base mb-1">
                {topic.name}
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {topic.description}
              </p>
              {selectedTopic === topic.id && (
                <motion.div
                  layoutId="topic-indicator"
                  className="absolute inset-0 border-2 border-primary rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Difficulty Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-center mb-6">
          Nível inicial
        </h2>
        <div className="flex gap-3 justify-center">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => {
            const Icon = difficultyIcons[difficulty];
            return (
              <motion.button
                key={difficulty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(difficulty)}
              className={`
                  flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${difficultyColors[difficulty]}
                  ${
                    selectedDifficulty === difficulty
                      ? difficulty === 'easy'
                        ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-background'
                        : difficulty === 'medium'
                          ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background'
                          : 'ring-2 ring-red-500 ring-offset-2 ring-offset-background'
                      : ''
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold text-sm">
                  {DIFFICULTY_LABELS[difficulty]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!selectedTopic || !selectedDifficulty || isLoading}
          className="
            px-8 py-6 text-lg font-display font-semibold
            bg-gradient-to-r from-primary to-cyan-400
            hover:from-primary/90 hover:to-cyan-400/90
            disabled:opacity-50 disabled:cursor-not-allowed
            glow-primary transition-all duration-300
          "
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Preparando...
            </>
          ) : (
            <>
              Iniciar Quiz
              <ChevronRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

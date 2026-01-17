import { motion } from 'framer-motion';
import { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOptionId: string | null;
  isAnswered: boolean;
  onSelectOption: (optionId: string) => void;
  onConfirm: () => void;
  onNext: () => void;
}

export const QuestionCard = ({
  question,
  selectedOptionId,
  isAnswered,
  onSelectOption,
  onConfirm,
  onNext,
}: QuestionCardProps) => {
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      {/* Question text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-xl sm:text-3xl font-display font-semibold leading-relaxed">
          {question.text}
        </h2>
      </motion.div>

      {/* Options */}
      <div className="grid gap-3 sm:gap-4 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrect = isAnswered && option.isCorrect;
          const showWrong = isAnswered && isSelected && !option.isCorrect;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !isAnswered && onSelectOption(option.id)}
              disabled={isAnswered}
              className={`
                relative p-4 sm:p-5 rounded-xl text-left transition-all duration-300
                ${
                  showCorrect
                    ? 'quiz-option-correct glow-success'
                    : showWrong
                    ? 'quiz-option-wrong glow-error animate-shake'
                    : isSelected
                    ? 'quiz-option quiz-option-selected'
                    : 'quiz-option'
                }
                ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Option letter */}
                <span
                  className={`
                    flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg
                    flex items-center justify-center font-display font-bold
                    ${
                      showCorrect
                        ? 'bg-success text-success-foreground'
                        : showWrong
                        ? 'bg-destructive text-destructive-foreground'
                        : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Option text */}
                <span className="flex-1 text-sm sm:text-base">{option.text}</span>

                {/* Result icon */}
                {showCorrect && (
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                )}
                {showWrong && (
                  <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (shown after answer) */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-4 sm:p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Explicação</p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action button */}
      <div className="flex justify-center">
        {!isAnswered ? (
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={!selectedOptionId}
            className="
              px-8 py-6 text-lg font-display font-semibold
              bg-gradient-to-r from-primary to-cyan-400
              hover:from-primary/90 hover:to-cyan-400/90
              disabled:opacity-50 disabled:cursor-not-allowed
              glow-primary transition-all duration-300
            "
          >
            Confirmar Resposta
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onNext}
            className={`
              px-8 py-6 text-lg font-display font-semibold
              transition-all duration-300
              ${
                isCorrect
                  ? 'bg-gradient-to-r from-success to-amber-400 hover:from-success/90 hover:to-amber-400/90 glow-success'
                  : 'bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 glow-primary'
              }
            `}
          >
            {isCorrect ? 'Continuar' : 'Próxima Pergunta'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

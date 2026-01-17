import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorState = ({ message, onRetry, onGoHome }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="relative">
          <AlertTriangle className="w-16 h-16 text-destructive" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 blur-xl bg-destructive/30 rounded-full"
          />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-display font-semibold mb-2 text-center"
      >
        Ops! Algo deu errado
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-center mb-6 max-w-md"
      >
        {message}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RotateCcw className="mr-2 w-4 h-4" />
            Tentar Novamente
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline">
            <Home className="mr-2 w-4 h-4" />
            Início
          </Button>
        )}
      </motion.div>
    </div>
  );
};

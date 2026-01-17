import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const LoadingQuestion = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <div className="relative">
          <Brain className="w-16 h-16 text-primary" />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 blur-xl bg-primary/30 rounded-full"
          />
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-lg text-muted-foreground font-medium"
      >
        Gerando pergunta...
      </motion.p>

      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
};

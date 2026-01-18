import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, TrendingUp, Clock, LogOut, History } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Perguntas Geradas por IA',
      description: 'Cada pergunta é única e criada em tempo real',
    },
    {
      icon: TrendingUp,
      title: 'Dificuldade Adaptativa',
      description: 'O quiz se ajusta ao seu desempenho',
    },
    {
      icon: Clock,
      title: 'Feedback Instantâneo',
      description: 'Saiba imediatamente se acertou ou errou',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with auth */}
      <header className="relative z-10 flex items-center justify-end p-4 gap-2">
        {user ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
          >
            Entrar
          </Button>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/25 mb-6"
          >
            <Brain className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Quiz Inteligente
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Desafie seus conhecimentos com perguntas geradas por IA que se adaptam ao seu nível
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4 mb-8"
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 text-left p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Começar Quiz
            </Button>
            
            {!user && (
              <p className="mt-4 text-sm text-muted-foreground">
                <button
                  onClick={() => navigate('/auth')}
                  className="text-primary hover:underline"
                >
                  Faça login
                </button>
                {' '}para salvar seu progresso
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

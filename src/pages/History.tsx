import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TOPICS } from '@/config/topics';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Clock, 
  Trophy,
  Loader2,
  History as HistoryIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QuizSessionRow {
  id: string;
  topic: string;
  initial_level: string;
  started_at: string;
  finished_at: string | null;
  total_questions: number;
  correct_answers: number;
}

export default function History() {
  const [sessions, setSessions] = useState<QuizSessionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadSessions();
    }
  }, [user, authLoading, navigate]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTopicConfig = (topicId: string) => {
    return TOPICS.find(t => t.id === topicId) || TOPICS[0];
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
            <p className="text-muted-foreground">Suas sessões anteriores</p>
          </div>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <HistoryIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma sessão ainda</h2>
            <p className="text-muted-foreground mb-6">
              Complete seu primeiro quiz para ver o histórico aqui
            </p>
            <Button onClick={() => navigate('/')}>
              Começar Quiz
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const topic = getTopicConfig(session.topic);
              const accuracy = getAccuracy(session.correct_answers, session.total_questions);
              const Icon = topic.icon;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Topic icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${topic.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: topic.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {topic.name}
                        </h3>
                        <span
                          className="text-sm font-medium px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${topic.color}15`,
                            color: topic.color 
                          }}
                        >
                          {session.initial_level === 'easy' ? 'Fácil' :
                           session.initial_level === 'medium' ? 'Médio' : 'Difícil'}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(session.started_at)}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-foreground font-medium">
                            {session.correct_answers}/{session.total_questions}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-quiz-success" />
                          <span className="text-foreground font-medium">
                            {accuracy}%
                          </span>
                        </div>

                        {!session.finished_at && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full">
                            Incompleto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

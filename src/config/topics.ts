import { 
  Code, 
  Landmark, 
  Calculator, 
  Globe, 
  FlaskConical, 
  MapPin,
  LucideIcon 
} from 'lucide-react';
import { TopicInfo, Topic } from '@/types/quiz';

// Map topic IDs to Lucide icons
export const TOPIC_ICONS: Record<Topic, LucideIcon> = {
  programming: Code,
  history: Landmark,
  mathematics: Calculator,
  general_knowledge: Globe,
  science: FlaskConical,
  geography: MapPin,
};

export const TOPICS: TopicInfo[] = [
  {
    id: 'programming',
    name: 'Programação',
    description: 'JavaScript, Python, algoritmos e conceitos de desenvolvimento',
    icon: Code,
    color: '#3b82f6',
  },
  {
    id: 'history',
    name: 'História',
    description: 'Eventos históricos, civilizações e personalidades marcantes',
    icon: Landmark,
    color: '#f59e0b',
  },
  {
    id: 'mathematics',
    name: 'Matemática',
    description: 'Cálculos, geometria, álgebra e lógica matemática',
    icon: Calculator,
    color: '#a855f7',
  },
  {
    id: 'general_knowledge',
    name: 'Conhecimentos Gerais',
    description: 'Curiosidades, cultura pop, atualidades e fatos diversos',
    icon: Globe,
    color: '#22c55e',
  },
  {
    id: 'science',
    name: 'Ciências',
    description: 'Física, química, biologia e descobertas científicas',
    icon: FlaskConical,
    color: '#14b8a6',
  },
  {
    id: 'geography',
    name: 'Geografia',
    description: 'Países, capitais, relevo e fenômenos geográficos',
    icon: MapPin,
    color: '#f43f5e',
  },
];

export const getTopicById = (id: Topic): TopicInfo | undefined => {
  return TOPICS.find((topic) => topic.id === id);
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

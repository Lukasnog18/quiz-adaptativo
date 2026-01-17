import { TopicInfo, Topic } from '@/types/quiz';

export const TOPICS: TopicInfo[] = [
  {
    id: 'programming',
    name: 'Programação',
    description: 'JavaScript, Python, algoritmos e conceitos de desenvolvimento',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'history',
    name: 'História',
    description: 'Eventos históricos, civilizações e personalidades marcantes',
    icon: '🏛️',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'mathematics',
    name: 'Matemática',
    description: 'Cálculos, geometria, álgebra e lógica matemática',
    icon: '📐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'general_knowledge',
    name: 'Conhecimentos Gerais',
    description: 'Curiosidades, cultura pop, atualidades e fatos diversos',
    icon: '🌍',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'science',
    name: 'Ciências',
    description: 'Física, química, biologia e descobertas científicas',
    icon: '🔬',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'geography',
    name: 'Geografia',
    description: 'Países, capitais, relevo e fenômenos geográficos',
    icon: '🗺️',
    color: 'from-rose-500 to-red-500',
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOPIC_NAMES: Record<string, string> = {
  programming: 'Programação (JavaScript, Python, algoritmos, conceitos de desenvolvimento de software)',
  history: 'História (eventos históricos, civilizações antigas, guerras, personalidades históricas)',
  mathematics: 'Matemática (cálculos, geometria, álgebra, lógica matemática)',
  general_knowledge: 'Conhecimentos Gerais (curiosidades, cultura pop, atualidades, fatos diversos)',
  science: 'Ciências (física, química, biologia, astronomia, descobertas científicas)',
  geography: 'Geografia (países, capitais, relevo, clima, fenômenos geográficos)',
};

const DIFFICULTY_DESCRIPTIONS: Record<string, string> = {
  easy: 'fácil (conceitos básicos, perguntas diretas, opções claramente distintas)',
  medium: 'médio (requer algum conhecimento, opções podem parecer similares)',
  hard: 'difícil (conhecimento aprofundado, detalhes específicos, opções muito similares)',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, difficulty, previousQuestions = [] } = await req.json();

    if (!topic || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'Topic and difficulty are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const topicName = TOPIC_NAMES[topic] || topic;
    const difficultyDesc = DIFFICULTY_DESCRIPTIONS[difficulty] || difficulty;
    
    const previousQuestionsText = previousQuestions.length > 0
      ? `\n\nNÃO repita estas perguntas já feitas:\n${previousQuestions.join('\n')}`
      : '';

    const systemPrompt = `Você é um gerador de perguntas de quiz educativo em português do Brasil. 
Você deve gerar perguntas interessantes, educativas e precisas.
Sempre forneça explicações claras e informativas após a resposta.
As perguntas devem ser apropriadas para o nível de dificuldade especificado.`;

    const userPrompt = `Gere UMA pergunta de múltipla escolha sobre o tema: ${topicName}

Nível de dificuldade: ${difficultyDesc}
${previousQuestionsText}

A pergunta deve ter exatamente 4 alternativas, sendo apenas UMA correta.
A explicação deve ser educativa e esclarecer por que a resposta correta é a certa.`;

    console.log('Generating question for topic:', topic, 'difficulty:', difficulty);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_question',
              description: 'Cria uma pergunta de quiz com 4 alternativas',
              parameters: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'O texto da pergunta',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', description: 'ID único da opção (a, b, c, d)' },
                        text: { type: 'string', description: 'Texto da alternativa' },
                        isCorrect: { type: 'boolean', description: 'Se esta é a resposta correta' },
                      },
                      required: ['id', 'text', 'isCorrect'],
                    },
                    minItems: 4,
                    maxItems: 4,
                  },
                  explanation: {
                    type: 'string',
                    description: 'Explicação educativa sobre a resposta correta',
                  },
                },
                required: ['text', 'options', 'explanation'],
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'create_question' } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Muitas requisições. Aguarde um momento.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Configure sua conta.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar pergunta. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the function call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_question') {
      console.error('Invalid AI response structure:', data);
      return new Response(
        JSON.stringify({ error: 'Resposta inválida da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const question = JSON.parse(toolCall.function.arguments);
    
    // Validate the question structure
    if (!question.text || !question.options || question.options.length !== 4 || !question.explanation) {
      console.error('Invalid question structure:', question);
      return new Response(
        JSON.stringify({ error: 'Estrutura de pergunta inválida' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure exactly one correct answer
    const correctCount = question.options.filter((o: { isCorrect: boolean }) => o.isCorrect).length;
    if (correctCount !== 1) {
      console.error('Invalid number of correct answers:', correctCount);
      return new Response(
        JSON.stringify({ error: 'Pergunta gerada com número inválido de respostas corretas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Question generated successfully');

    return new Response(
      JSON.stringify({ question }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-question:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

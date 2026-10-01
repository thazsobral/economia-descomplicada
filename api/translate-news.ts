import { GoogleGenAI, Type } from '@google/genai';

interface RequestBody {
  headline: string;
  provider?: 'gemini' | 'openai' | 'groq';
  apiKey?: string;
}

const SYSTEM_INSTRUCTION = `Você é um mentor amigo de economia extremamente didático e empático. Seu papel é explicar notícias econômicas, políticas ou gerais para leigos sob a ótica do bolso do cidadão e da economia real.

Mesmo quando a notícia for sobre política, eleições ou disputas partidárias, analise se ela tem impacto real nos preços, juros, inflação ou mercado de trabalho, ou se é apenas ruído político sem impacto econômico direto imediato.

Sempre responda estritamente em formato JSON com o seguinte formato:
{
  "verdict": "Tapa-Buraco 🩹" OU "Solução Real 🌱" OU "Informativo/Impacto Direto 💡" OU "Ruído Político / Impacto Indireto 🏛️",
  "verdictEmoji": "🩹" OU "🌱" OU "💡" OU "🏛️",
  "simpleTitle": "Título amigável de 3 a 6 palavras",
  "simpleExplanation": "2 a 3 frases bem simples explicando o impacto prático no dia a dia e no bolso das pessoas.",
  "questionMessage": "Pergunta reflexiva curta e provocativa.",
  "impactScore": número entre -5 e 5 (onde 0 é neutro, positivo é bom para o bolso, negativo encarece a vida),
  "keyTakeaway": "Uma lição de 1 frase marcante."
}`;

function parseJsonSafely(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { headline, provider = 'gemini', apiKey }: RequestBody = req.body || {};

    if (!headline || typeof headline !== 'string' || headline.trim() === '') {
      return res.status(400).json({ error: 'Por favor, envie um texto ou notícia válido.' });
    }

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return res.status(400).json({
        error: 'Nenhuma chave de IA configurada. Por favor, adicione sua chave de API pessoal no menu "Chave de IA" para traduzir com o mentor econômico.',
        needsKey: true,
      });
    }

    const cleanKey = apiKey.trim();
    const prompt = `Analise a seguinte notícia e explique seu impacto econômico no dia a dia: "${headline.trim()}"`;

    // 1. Provedor Google Gemini
    if (provider === 'gemini') {
      const ai = new GoogleGenAI({
        apiKey: cleanKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
        },
      });

      let responseText: string | undefined;

      // Modelos padrão recomendados na documentação oficial: gemini-3.8-flash e gemini-flash-latest
      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let lastGeminiErr: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  verdict: { type: Type.STRING },
                  verdictEmoji: { type: Type.STRING },
                  simpleTitle: { type: Type.STRING },
                  simpleExplanation: { type: Type.STRING },
                  questionMessage: { type: Type.STRING },
                  impactScore: { type: Type.NUMBER },
                  keyTakeaway: { type: Type.STRING },
                },
                required: [
                  'verdict',
                  'verdictEmoji',
                  'simpleTitle',
                  'simpleExplanation',
                  'questionMessage',
                  'impactScore',
                  'keyTakeaway',
                ],
              },
            },
          });
          responseText = response.text;
          if (responseText) break;
        } catch (mErr: any) {
          lastGeminiErr = mErr;
          console.warn(`Tentativa com modelo Gemini ${modelName} falhou:`, mErr?.message || mErr);
          // Se for erro de autenticação/chave inválida, não adianta tentar outros modelos
          if (
            mErr?.status === 400 &&
            (mErr?.message?.includes('API_KEY_INVALID') || mErr?.message?.includes('API key not valid'))
          ) {
            return res.status(401).json({
              error: 'Chave de API do Gemini inválida.',
              details: 'Verifique se copiou a chave correta no Google AI Studio (começa com "AIzaSy...").',
            });
          }
        }
      }

      if (!responseText) {
        throw new Error(
          lastGeminiErr?.message || 'O Google Gemini não retornou resposta com os modelos disponíveis.'
        );
      }

      const parsed = parseJsonSafely(responseText);
      return res.status(200).json(parsed);
    }

    // 2. Provedor OpenAI (ChatGPT)
    if (provider === 'openai') {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!openaiRes.ok) {
        const errJson = await openaiRes.json().catch(() => null);
        const errMsg = errJson?.error?.message || `Erro HTTP ${openaiRes.status} na OpenAI`;
        if (openaiRes.status === 401) {
          return res.status(401).json({
            error: 'Chave da OpenAI inválida ou não autorizada.',
            details: 'Verifique se a chave de API da OpenAI está correta e se sua conta possui créditos.',
          });
        }
        throw new Error(errMsg);
      }

      const openAiData = await openaiRes.json();
      const content = openAiData?.choices?.[0]?.message?.content;
      if (!content) throw new Error('A OpenAI não retornou resposta.');
      return res.status(200).json(parseJsonSafely(content));
    }

    // 3. Provedor Groq (Llama 3.3)
    if (provider === 'groq') {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!groqRes.ok) {
        const errJson = await groqRes.json().catch(() => null);
        const errMsg = errJson?.error?.message || `Erro HTTP ${groqRes.status} na Groq`;
        if (groqRes.status === 401) {
          return res.status(401).json({
            error: 'Chave da Groq inválida.',
            details: 'Verifique se copiou a chave correta no Groq Console (começa com "gsk_...").',
          });
        }
        throw new Error(errMsg);
      }

      const groqData = await groqRes.json();
      const content = groqData?.choices?.[0]?.message?.content;
      if (!content) throw new Error('A Groq não retornou resposta.');
      return res.status(200).json(parseJsonSafely(content));
    }

    return res.status(400).json({ error: `Provedor de IA desconhecido: ${provider}` });

  } catch (err: any) {
    console.error('Erro na API de tradução:', err);

    const msg = err.message || '';
    if (
      msg.includes('The caller does not have permission') ||
      msg.includes('PERMISSION_DENIED') ||
      err?.status === 403
    ) {
      return res.status(403).json({
        error: 'Permissão negada pelo Google Cloud / AI Studio.',
        details: 'A chave fornecida não tem permissão para usar a API Generative Language. No Google AI Studio, crie a chave escolhendo "Create API key in new project", ou use o provedor Groq / OpenAI no menu.',
      });
    }

    if (
      msg.includes('API_KEY_INVALID') ||
      msg.includes('401') ||
      msg.includes('unauthorized') ||
      msg.includes('API key not valid')
    ) {
      return res.status(401).json({
        error: 'Sua chave de API parece inválida ou expirou.',
        details: 'Por favor, confira a chave inserida no menu "Chave de IA".',
      });
    }

    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'Cota do provedor de IA atingida ou limite de requisições excedido.',
        details: 'Aguarde alguns segundos ou experimente outro provedor no menu.',
      });
    }

    return res.status(500).json({
      error: 'Ocorreu um erro ao processar com a IA selecionada.',
      details: err.message || 'Erro desconhecido',
    });
  }
}

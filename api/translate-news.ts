import { GoogleGenAI, Type } from '@google/genai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { headline } = req.body || {};
    if (!headline || typeof headline !== 'string' || headline.trim() === '') {
      return res.status(400).json({ error: 'Por favor, envie um texto ou notícia válido.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        verdict: 'Análise Amigável',
        verdictEmoji: '💡',
        simpleTitle: 'Entendendo o impacto no seu bolso',
        simpleExplanation: `Analisando a frase: "${headline.slice(0, 80)}...". Quando o governo ou bancos tomam essa medida, o efeito prático é mudar quanto dinheiro circula no mercado.`,
        questionMessage: 'Essa medida ajuda a consertar a causa raiz do problema ou é apenas um alívio passageiro?',
        impactScore: 0,
        keyTakeaway: 'Lembre-se: se criar mais dinheiro sem produzir mais coisas, o preço de tudo sobe!',
        isFallback: true,
      });
    }

    const prompt = `Analise a seguinte notícia ou medida econômica: "${headline}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é um mentor amigo de economia extremamente didático e empático. Seu papel é explicar notícias econômicas complexas para leigos.

Sempre responda em JSON estrito com o seguinte esquema:
- verdict: 'Tapa-Buraco 🩹' OU 'Solução Real 🌱' OU 'Informativo/Impacto Direto 💡'
- verdictEmoji: '🩹', '🌱', ou '💡'
- simpleTitle: Título amigável de 3 a 6 palavras
- simpleExplanation: 2 a 3 frases bem simples explicando o impacto prático.
- questionMessage: Pergunta chave reflexiva.
- impactScore: Número de -5 a +5
- keyTakeaway: Uma lição de 1 frase marcante.`,
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

    const resultText = response.text;
    if (!resultText) throw new Error('Não foi possível gerar a resposta.');

    return res.status(200).json(JSON.parse(resultText));
  } catch (err: any) {
    console.error('Erro na API de tradução:', err);

    // Se der erro de cota (429), retorna um mock amigável no ambiente local
    if (err?.status === 429 || err?.message?.includes('429')) {
      console.warn('⚠️ Cota estourada! Retornando mock local de desenvolvimento.');
      return res.status(200).json({
        verdict: 'Análise Amigável (Modo Offline)',
        verdictEmoji: '💡',
        simpleTitle: 'Entendendo o impacto no seu bolso',
        simpleExplanation: `Analisando a frase enviada. Quando o governo ou bancos tomam essa medida, o efeito prático é alterar a quantidade de dinheiro em circulação no mercado.`,
        questionMessage: 'Essa medida ajuda a consertar a causa raiz do problema ou é apenas um alívio passageiro?',
        impactScore: 0,
        keyTakeaway: 'Lembre-se: se criar mais dinheiro sem produzir mais coisas, o preço de tudo sobe!',
      });
    }

    return res.status(500).json({
      error: 'Ocorreu um erro ao processar com a IA.',
      details: err.message || 'Erro desconhecido',
    });
  }
}
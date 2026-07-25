import { GoogleGenAI, Type, Schema } from '@google/genai';

// Instancia o cliente usando a chave no ambiente
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { headline } = await req.json();

    if (!headline) {
      return new Response(JSON.stringify({ error: 'Headline obrigatória' }), { status: 400 });
    }

    // Esquema de resposta estruturada para garantir a tipagem do Front-end
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        verdictEmoji: { type: Type.STRING },
        verdict: { type: Type.STRING },
        questionMessage: { type: Type.STRING },
        simpleTitle: { type: Type.STRING },
        simpleExplanation: { type: Type.STRING },
        keyTakeaway: { type: Type.STRING },
      },
      required: ['verdictEmoji', 'verdict', 'questionMessage', 'simpleTitle', 'simpleExplanation', 'keyTakeaway'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um especialista em finanças e economia.
Traduza e explique a seguinte manchete em linguagem simples para um leigo:
"${headline}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error('Resposta vazia da IA');

    return new Response(resultText, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro na rota de tradução:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
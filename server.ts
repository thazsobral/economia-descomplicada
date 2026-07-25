import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for Translating Economic News
app.post("/api/translate-news", async (req, res) => {
  try {
    const { headline } = req.body;
    if (!headline || typeof headline !== "string" || headline.trim() === "") {
      return res.status(400).json({ error: "Por favor, envie um texto ou notícia válido." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if API key is not yet set
      return res.json({
        verdict: "Análise Amigável",
        verdictEmoji: "💡",
        simpleTitle: "Entendendo o impacto no seu bolso",
        simpleExplanation: `Analisando a frase: "${headline.slice(0, 80)}...". Quando o governo ou bancos tomam essa medida, o efeito prático é mudar quanto dinheiro circula no mercado em relação às coisas disponíveis para comprar.`,
        questionMessage: "Essa medida ajuda a consertar a causa raiz do problema ou é apenas um alívio passageiro?",
        impactScore: 0,
        keyTakeaway: "Lembre-se: se criar mais dinheiro sem produzir mais coisas, o preço de tudo sobe!",
        isFallback: true
      });
    }

    const prompt = `Analise a seguinte notícia ou medida econômica: "${headline}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `Você é um mentor amigo de economia extremamente didático e empático. Seu papel é explicar notícias econômicas complexas para leigos e crianças em linguagem simples e cotidiana, sem jargões técnicos ("economês").

Sempre responda em JSON estrito com o seguinte esquema:
- verdict: 'Tapa-Buraco 🩹' (medida de curto prazo/imprimi dinheiro/congelar preço) OU 'Solução Real 🌱' (aumenta produção/corta desperdício/investe em tecnologia) OU 'Informativo/Impacto Direto 💡'
- verdictEmoji: '🩹', '🌱', ou '💡'
- simpleTitle: Título amigável e curto de 3 a 6 palavras
- simpleExplanation: 2 a 3 frases bem simples explicando o que isso significa na vida real de uma pessoa comum (comida, compras, empregos).
- questionMessage: Uma pergunta chave reflexiva, como: 'Essa medida ajuda a consertar a causa do problema ou é apenas um alívio passageiro?'
- impactScore: Um número de -5 (muito perigoso para inflação) a +5 (muito positivo para a economia real)
- keyTakeaway: Uma lição moral de 1 frase marcante que qualquer criança entenderia.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            verdictEmoji: { type: Type.STRING },
            simpleTitle: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            questionMessage: { type: Type.STRING },
            impactScore: { type: Type.NUMBER },
            keyTakeaway: { type: Type.STRING }
          },
          required: ["verdict", "verdictEmoji", "simpleTitle", "simpleExplanation", "questionMessage", "impactScore", "keyTakeaway"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Não foi possível gerar a resposta.");
    }

    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error("Erro na API de tradução de notícias:", err);
    return res.status(500).json({
      error: "Ocorreu um erro ao processar com a IA.",
      details: err.message || "Erro desconhecido"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor de Economia Descomplicada rodando na porta ${PORT}`);
  });
}

startServer();

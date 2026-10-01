import { AIConfig, AIProvider } from '../types';

export const AI_CONFIG_STORAGE_KEY = 'economia_descomplicada_ai_config';

export interface ProviderMeta {
  id: AIProvider;
  name: string;
  badge: string;
  keyUrl: string;
  linkLabel: string;
  placeholder: string;
  description: string;
  model: string;
  instructions: string;
}

export const AI_PROVIDERS: Record<AIProvider, ProviderMeta> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Recomendado • Gratuito',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    linkLabel: 'Criar chave gratuita no Google AI Studio ↗',
    placeholder: 'Cole sua chave AIzaSy...',
    description: 'Chave oficial do Google Gemini com cota gratuita generosa para testes e estudos.',
    model: 'Gemini 3.8 Flash / Flash Latest',
    instructions: 'Acesse o Google AI Studio, faça login e clique em "Create API key" -> selecione "Create API key in new project" (para evitar erros de permissão de organizações ou projetos existentes).'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    badge: 'Popular',
    keyUrl: 'https://platform.openai.com/api-keys',
    linkLabel: 'Criar chave na OpenAI Platform ↗',
    placeholder: 'Cole sua chave sk-proj-...',
    description: 'Modelos GPT-4o Mini da OpenAI. Requer créditos ativos em sua conta da OpenAI.',
    model: 'GPT-4o Mini',
    instructions: 'Acesse o dashboard da OpenAI Platform, vá em API keys e clique em "Create new secret key".'
  },
  groq: {
    id: 'groq',
    name: 'Groq (Llama 3.3)',
    badge: 'Ultra Rápido • Gratuito',
    keyUrl: 'https://console.groq.com/keys',
    linkLabel: 'Criar chave gratuita no Groq Console ↗',
    placeholder: 'Cole sua chave gsk_...',
    description: 'Processamento em milissegundos com modelo Llama 3.3 70B gratuito para desenvolvedores.',
    model: 'Llama 3.3 70B Versatile',
    instructions: 'Acesse o Groq Console, crie sua conta gratuita e gere sua API Key na aba API Keys.'
  }
};

export const getStoredAIConfig = (): AIConfig => {
  if (typeof window === 'undefined') {
    return { provider: 'gemini', apiKey: '' };
  }
  try {
    const raw = localStorage.getItem(AI_CONFIG_STORAGE_KEY);
    if (!raw) return { provider: 'gemini', apiKey: '' };
    const parsed = JSON.parse(raw);
    const validProvider: AIProvider =
      parsed.provider && AI_PROVIDERS[parsed.provider as AIProvider]
        ? parsed.provider
        : 'gemini';
    return {
      provider: validProvider,
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : ''
    };
  } catch (e) {
    console.error('Erro ao ler configuração de IA do localStorage:', e);
    return { provider: 'gemini', apiKey: '' };
  }
};

export const saveStoredAIConfig = (config: AIConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify({
      provider: config.provider,
      apiKey: config.apiKey.trim()
    }));
    // Dispatch custom event so all components react immediately
    window.dispatchEvent(new Event('ai-config-changed'));
  } catch (e) {
    console.error('Erro ao salvar configuração de IA no localStorage:', e);
  }
};

export const clearStoredAIConfig = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AI_CONFIG_STORAGE_KEY);
    window.dispatchEvent(new Event('ai-config-changed'));
  } catch (e) {
    console.error('Erro ao limpar configuração de IA no localStorage:', e);
  }
};

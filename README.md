# 💡 Economia Descomplicada

O **Economia Descomplicada** é uma aplicação web interativa projetada para traduzir termos, índices e notícias econômicas complexas (o famoso "economês") para uma linguagem simples, didática e acessível a qualquer pessoa.

A plataforma conta com simuladores, quiz, dicionário de termos e um **Tradutor de Notícias inteligente powered by Gemini AI**.

---

## 🚀 Tecnologias Utilizadas

### Front-end
- **React 19** + **TypeScript**
- **Vite** (Build tool e Dev Server)
- **Tailwind CSS** (Estilização)
- **Lucide React** (Ícones)
- **Framer Motion** (Animações)
- **Recharts** (Gráficos interativos)

### Back-end & Serverless
- **Node.js** com **Express** (Servidor de desenvolvimento local)
- **Vercel Serverless Functions** (API em produção)
- **@google/genai** (Integração oficial com a API do Google Gemini)

---

## 🛠️ Arquitetura do Projeto

O projeto foi estruturado para ter paridade total entre o **desenvolvimento local** e a **produção na Vercel**:

- **/api/translate-news.ts**: Função Serverless isolada que consome a API do Gemini. Em produção, a Vercel a executa nativamente na nuvem.
- **server.ts**: Servidor Express local que delega as requisições para a rota `/api/translate-news`, permitindo testar toda a aplicação localmente sem depender do CLI da Vercel.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **npm**, **yarn** ou **bun**
- Uma chave de API do **Google Gemini** (obtenha gratuitamente no [Google AI Studio](https://aistudio.google.com/))

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/thazsobral/economia-descomplicada.git](https://github.com/thazsobral/economia-descomplicada.git)
   cd economia-descomplicada

```

2. **Instale as dependências:**
```bash
npm install

```


3. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env.local` na raiz do projeto com a sua chave do Gemini:
```env
GEMINI_API_KEY=sua_chave_aqui

```


4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev

```


5. **Acesse no navegador:**
O projeto estará rodando em `http://localhost:3000`.

---

## ☁️ Deploy na Vercel

1. Importe o repositório `thazsobral/economia-descomplicada` no painel da **Vercel**.
2. Defina o **Framework Preset** como **Vite**.
3. Adicione a variável de ambiente no painel da Vercel (*Settings > Environment Variables*):
* **Key:** `GEMINI_API_KEY`
* **Value:** `sua_chave_do_gemini`


4. Clique em **Deploy**.

A Vercel fará o build do front-end React e compilará automaticamente a pasta `/api` como rotas Serverless puras.

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para estudar, modificar e contribuir!

---

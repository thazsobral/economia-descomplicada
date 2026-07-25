import { GlossaryTerm, TimelineScenario, QuizQuestion } from '../types';

export const SAMPLE_HEADLINES = [
  {
    title: "Governo estuda criar notas de R$ 500 para aumentar o dinheiro circulante",
    category: "Impressão de Dinheiro",
    badge: "Tapa-Buraco 🩹"
  },
  {
    title: "Super safra de grãos e nova tecnologia reduzem custo do quilo de alimentos",
    category: "Produtividade",
    badge: "Solução Real 🌱"
  },
  {
    title: "Decreto fixa preço máximo para o leite e carne nos supermercados",
    category: "Controle de Preços",
    badge: "Tapa-Buraco 🩹"
  },
  {
    title: "Investimento em ferrovias reduz custo do frete de mercadorias em 35%",
    category: "Infraestrutura",
    badge: "Solução Real 🌱"
  },
  {
    title: "Banco Central eleva taxa de juros para conter corrida de compras no varejo",
    category: "Juros e Consumo",
    badge: "Sala de Controle 🧊"
  }
];

export const TIMELINE_SCENARIOS: TimelineScenario[] = [
  {
    id: "short_term_print",
    title: "Solução de Curto Prazo (Tapa-Buraco)",
    type: "short_term",
    subtitle: "Imprimir mais notas ou congelar preços na marretada",
    summary: "Parece uma ideia mágica no primeiro dia: todo mundo acorda com mais notas na carteira! Mas como as fábricas não produziram mais coisas, a disputa pelos mesmos produtos faz tudo disparar.",
    badge: "Ciclo Vicioso ⚠️",
    steps: [
      {
        period: "Dia 1",
        title: "Injeção Magnética de Dinheiro",
        description: "O governo cria R$ 100 bilhões do nada e distribui. Todos correm pro mercado felizes com notas no bolso.",
        icon: "Banknote",
        statusType: "warning",
        impactText: "Sensação imediata de riqueza ilusória."
      },
      {
        period: "Mês 3",
        title: "As Prateleiras Esvaziam",
        description: "As pessoas querem comprar 3x mais biscoito e carne, mas os produtores ainda fabricam a mesma quantidade de antes.",
        icon: "ShoppingBag",
        statusType: "warning",
        impactText: "Estoque acaba rápido e filas começam a se formar."
      },
      {
        period: "Mês 6",
        title: "Explosão de Preços (Inflação)",
        description: "Para decidir quem leva o último pacote de arroz, o dono do mercado dobra o preço. A nota de R$ 100 agora compra o que R$ 20 comprava.",
        icon: "TrendingUp",
        statusType: "danger",
        impactText: "O seu dinheiro perde poder de compra de forma avassaladora."
      },
      {
        period: "Ano 1",
        title: "Escassez e Desespero",
        description: "Tentam congelar o preço no grito. Os produtores tomam prejuízo e param de fabricar. Falta leite, carne e remédio.",
        icon: "AlertTriangle",
        statusType: "danger",
        impactText: "O tapa-buraco criou uma crise pior que o problema inicial."
      }
    ]
  },
  {
    id: "long_term_grow",
    title: "Solução de Longo Prazo (Crescimento Sólido)",
    type: "long_term",
    subtitle: "Aumentar a produção, usar tecnologia e cortar desperdícios",
    summary: "Exige esforço e paciência no começo, mas constrói estradas, treina trabalhadores e instala máquinas modernas. Com muito mais mercadorias sendo produzidas com facilidade, os preços caem naturalmente!",
    badge: "Caminho Sólido 🏆",
    steps: [
      {
        period: "Mês 1",
        title: "Investimento em Estrutura",
        description: "Em vez de inventar dinheiro, o país constrói estradas melhores, energia barata e treina as pessoas.",
        icon: "Wrench",
        statusType: "neutral",
        impactText: "Início do trabalho duro e organização das contas públicas."
      },
      {
        period: "Mês 6",
        title: "Aumento da Eficiência",
        description: "Com estradas boas e tratores modernos, transportar comida fica 40% mais barato e rápido.",
        icon: "Zap",
        statusType: "success",
        impactText: "O custo de fabricar cada produto começa a despencar."
      },
      {
        period: "Ano 1",
        title: "Abundância no Mercado",
        description: "Agora há 5 vezes mais maçãs, leite e celulares sendo produzidos com facilidade. Os mercados competem entre si.",
        icon: "Boxes",
        statusType: "success",
        impactText: "Os preços caem e o seu salário passa a render muito mais de verdade!"
      },
      {
        period: "Ano 2+",
        title: "Prosperidade Sustentável",
        description: "Mais empregos de qualidade são criados porque as empresas cresceram em bases reais, sem bolha de dinheiro falso.",
        icon: "ShieldCheck",
        statusType: "success",
        impactText: "Enriquecimento real da sociedade sem sobressaltos."
      }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "inflacao",
    term: "Inflação",
    technicalTerm: "Aumento generalizado de preços",
    analogyTitle: "O Monstro do Dinheiro Encolhedor 👾",
    analogyDescription: "Não é que o pão ficou 'mágico e valioso'. É que a sua nota de dinheiro encolheu e precisa de mais notas para comprar a mesma coisa!",
    iconName: "TrendingUp",
    realExample: "Se há 1 ano com R$ 10 você comprava 10 pãezinhos e hoje compra apenas 5, a inflação encolheu o valor das suas notas pela metade."
  },
  {
    id: "taxa_selic",
    term: "Taxa de Juros (Selic)",
    technicalTerm: "Taxa básica da economia estipulada pelo Banco Central",
    analogyTitle: "O Freio da Bicicleta da Economia 🚲",
    analogyDescription: "Se a bicicleta está rápida demais e quase batendo na parede da inflação, o Banco Central puxa o freio (aumenta os juros) para todos irem com mais calma.",
    iconName: "Gauge",
    realExample: "Juros altos tornam o empréstimo mais caro. Assim, as pessoas adiam compras grandes e as lojas precisam baixar preços para atrair clientes."
  },
  {
    id: "oferta_demanda",
    term: "Oferta e Demanda",
    technicalTerm: "Lei da escassez e procura de mercado",
    analogyTitle: "A Regra das Figurinhas Raras 🃏",
    analogyDescription: "Se todo mundo no recreio tem a mesma figurinha, ela vale 1 chiclete. Se só existe UMA no colégio inteiro e 50 crianças querem, ela passa a valer uma caixa inteira de doces!",
    iconName: "Scale",
    realExample: "Na época de seca, poucas laranjas nascem (pouca oferta). Como todos continuam querendo suco (alta demanda), a laranja fica cara."
  },
  {
    id: "pib",
    term: "PIB (Produto Interno Bruto)",
    technicalTerm: "Soma de todas as riquezas produzidas",
    analogyTitle: "O Tamanho do Bolo da Cidade 🎂",
    analogyDescription: "É o tamanho total de tudo de útil que a comunidade fabricou no ano: pães, carros, aulas ministradas, cortes de cabelo e softwares.",
    iconName: "PieChart",
    realExample: "Se o PIB cresce 4%, significa que o bolo do país aumentou e há mais riquezas reais divididas na sociedade."
  },
  {
    id: "impressao_dinheiro",
    term: "Impressão de Dinheiro Sem Lastro",
    technicalTerm: "Emissão monetária sem contrapartida de bens",
    analogyTitle: "Colocar Água no Leite 🥛",
    analogyDescription: "Se você tem 1 litro de leite puro e mistura com 10 litros de água para servir 11 pessoas, ninguém bebe leite de verdade, só água suja!",
    iconName: "Printer",
    realExample: "Imprimir notas não cria mais trigo nem médicos; apenas dilui o poder de compra das notas existentes."
  },
  {
    id: "poder_compra",
    term: "Poder de Compra",
    technicalTerm: "Capacidade adquisitiva da moeda",
    analogyTitle: "A Cestinha Real do Mercado 🧺",
    analogyDescription: "Não importa se o seu salário é R$ 1.000 ou R$ 10.000. O que importa de verdade é quantas maçãs, ovos e livros cabem na sua cestinha com ele.",
    iconName: "ShoppingBasket",
    realExample: "Em países com moeda forte, um salário mínimo enche vários carrinhos de mercado; em países hiperinflacionados, uma mala cheia de notas não paga um café."
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Imagine que numa ilha há 10 bananas e R$ 10 circulando (cada banana custa R$ 1). O governo imprime mais R$ 90 e distribui. O que acontece com o preço das bananas?",
    options: [
      {
        label: "Cada banana continua custando R$ 1 e todos ficam 10x mais ricos.",
        isCorrect: false,
        explanation: "Incorreto! Imprimir papel não produziu nenhuma banana a mais na árvore."
      },
      {
        label: "O preço da banana sobe para R$ 10 cada, pois as mesmas 10 bananas agora disputam R$ 100.",
        isCorrect: true,
        explanation: "Exato! Mais dinheiro atrás da mesma quantidade de coisas gera inflação proporcional."
      },
      {
        label: "As bananas somem para sempre.",
        isCorrect: false,
        explanation: "Elas não somem magicamente, mas ficam muito mais caras."
      }
    ]
  },
  {
    id: 2,
    question: "Por que o Banco Central AUMENTA os juros quando a inflação está muito alta?",
    options: [
      {
        label: "Para deixar o crédito mais caro, esfriar a correria de compras e fazer os preços pararem de subir.",
        isCorrect: true,
        explanation: "Perfeito! Aumentar juros é o 'freio da bicicleta' para desconfiar a correria de consumo."
      },
      {
        label: "Para fazer as fábricas fecharem voluntariamente.",
        isCorrect: false,
        explanation: "Não. O objetivo é equilibrar o ritmo de consumo com o ritmo de produção."
      },
      {
        label: "Porque o Banco Central quer arrecadar mais dinheiro para guardar no cofre.",
        isCorrect: false,
        explanation: "Incorreto. A Selic é um instrumento de controle monetário, não um imposto."
      }
    ]
  },
  {
    id: 3,
    question: "Qual é a ÚNICA forma real de fazer as coisas ficarem mais baratas no longo prazo para todos de forma sustentável?",
    options: [
      {
        label: "Proibir por lei qualquer comerciante de subir preços.",
        isCorrect: false,
        explanation: "Controis na marretada causam escassez e prateleiras vazias."
      },
      {
        label: "Aumentar a produtividade: produzir muito mais mercadorias usando tecnologia e boa infraestrutura.",
        isCorrect: true,
        explanation: "Excelente! Quando há abundância de produtos bem fabricados, o preço cai de verdade."
      },
      {
        label: "Dar uma máquina de imprimir dinheiro para cada família.",
        isCorrect: false,
        explanation: "Isso causaria hiperinflação e destruição completa da moeda em dias."
      }
    ]
  }
];

export const locales = ["pt", "en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const localeLabels: Record<Locale, { code: string; flag: string }> = {
  pt: {
    code: "PT",
    flag: "🇧🇷",
  },
  en: {
    code: "EN",
    flag: "🇺🇸",
  },
  es: {
    code: "ES",
    flag: "🇪🇸",
  },
};

const htmlLangByLocale: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const translations = {
  pt: {
    meta: {
      title: "Nodele",
      description: "Descubra os nós ocultos da árvore binária.",
    },
    app: {
      title: "Nodele",
      intro: "Escolha a dificuldade para gerar uma fase aleatória. Quanto maior a dificuldade, maior a quantidade de nós ocultos.",
      difficultyTitle: "Dificuldade",
      settingsTitle: "Configurações da partida",
      autoBalanceLabel: "Auto balancear árvore",
      autoBalanceHint: "Ligado: a árvore é reorganizada após cada jogada para ficar mais equilibrada. Desligado: a estrutura cresce naturalmente como BST.",
      autoBalanceAria: "Alternar auto balanceamento",
      autoBalanceInfo: "Explicação do auto balanceamento",
      languageLabel: "Idioma",
      startGame: "Iniciar partida",
      boardTitle: "Descubra os nós ocultos da árvore binária.",
      remainingHidden: "ocultos restantes",
      autoBalanceOn: "ligado",
      autoBalanceOff: "desligado",
      gameSectionTitle: "Partida em andamento",
      moveTitle: "Jogada",
      legendTitle: "Legenda",
      controlsTitle: "Controles",
      newPhase: "Nova fase",
      menuInitial: "Menu inicial",
      difficulty: {
        easy: {
          label: "Fácil",
          hint: "Menos nós ocultos para aquecer.",
        },
        medium: {
          label: "Médio",
          hint: "Equilibrado para partidas padrão.",
        },
        hard: {
          label: "Difícil",
          hint: "Mais nós ocultos e mais espaço para erro.",
        },
        brutal: {
          label: "Brutal",
          hint: "Começa com 8 nós ocultos e nenhum no visível.",
        },
      },
    },
    guessInput: {
      label: "Seu palpite",
      placeholder: "Ex: 30",
      submit: "Inserir",
    },
    legend: {
      fixed: "Nó sólido: valor oficial da solução",
      hidden: "Nó oculto: precisa ser revelado com o valor certo",
      ghost: "Nó fantasma: palpite incorreto inserido na BST",
      allowedRange: (maxValue: number) => `Valores permitidos para palpites: de 1 a ${maxValue}.`,
      treeLogic: "Lógica da árvore: valores menores que o nó atual vão para a esquerda, e valores maiores vão para a direita.",
    },
    tree: {
      exportImage: "Exportar imagem",
      exporting: "Exportando...",
      zoom: "Zoom",
      zoomOutAria: "Diminuir zoom",
      zoomInAria: "Aumentar zoom",
      exportError: "Não foi possível exportar a imagem da árvore.",
    },
    node: {
      hidden: "Nó oculto",
      ghost: (label: string) => `Nó fantasma ${label}`,
      fixed: (label: string) => `Nó fixo ${label}`,
    },
    game: {
      initialMessage: (difficultyLabel: string, autoBalance: boolean) =>
        `Descubra os nós ocultos. Dificuldade: ${difficultyLabel}. Balanceamento automático: ${autoBalance ? "ligado" : "desligado"}.`,
      duplicate: "Você já tentou esse valor.",
      revealed: "Acerto! Um nó oculto foi revelado.",
      ghost: "Esse valor não era oculto e entrou como nó fantasma.",
      won: "Parabéns! Você revelou todos os nós ocultos.",
    },
    footer: {
      developedBy: "Desenvolvido por:",
    },
  },
  en: {
    meta: {
      title: "Nodele",
      description: "Reveal the hidden nodes in the binary tree.",
    },
    app: {
      title: "Nodele",
      intro: "Choose a difficulty to generate a random round. The harder it is, the more hidden nodes there are.",
      difficultyTitle: "Difficulty",
      settingsTitle: "Match settings",
      autoBalanceLabel: "Auto-balance tree",
      autoBalanceHint: "On: the tree is reorganized after every move to stay more balanced. Off: the structure grows naturally like a BST.",
      autoBalanceAria: "Toggle auto-balance",
      autoBalanceInfo: "Auto-balance explanation",
      languageLabel: "Language",
      startGame: "Start game",
      boardTitle: "Reveal the hidden nodes in the binary tree.",
      remainingHidden: "hidden left",
      autoBalanceOn: "on",
      autoBalanceOff: "off",
      gameSectionTitle: "Match in progress",
      moveTitle: "Move",
      legendTitle: "Legend",
      controlsTitle: "Controls",
      newPhase: "New round",
      menuInitial: "Main menu",
      difficulty: {
        easy: {
          label: "Easy",
          hint: "Fewer hidden nodes to warm up.",
        },
        medium: {
          label: "Medium",
          hint: "Balanced for standard rounds.",
        },
        hard: {
          label: "Hard",
          hint: "More hidden nodes and more room for mistakes.",
        },
        brutal: {
          label: "Brutal",
          hint: "Starts with 8 hidden nodes and none visible.",
        },
      },
    },
    guessInput: {
      label: "Your guess",
      placeholder: "Ex: 30",
      submit: "Insert",
    },
    legend: {
      fixed: "Solid node: official solution value",
      hidden: "Hidden node: must be revealed with the correct value",
      ghost: "Ghost node: wrong guess inserted into the BST",
      allowedRange: (maxValue: number) => `Allowed guess values: 1 to ${maxValue}.`,
      treeLogic: "Tree logic: values smaller than the current node go left, and larger values go right.",
    },
    tree: {
      exportImage: "Export image",
      exporting: "Exporting...",
      zoom: "Zoom",
      zoomOutAria: "Zoom out",
      zoomInAria: "Zoom in",
      exportError: "Could not export the tree image.",
    },
    node: {
      hidden: "Hidden node",
      ghost: (label: string) => `Ghost node ${label}`,
      fixed: (label: string) => `Fixed node ${label}`,
    },
    game: {
      initialMessage: (difficultyLabel: string, autoBalance: boolean) =>
        `Reveal the hidden nodes. Difficulty: ${difficultyLabel}. Auto-balance: ${autoBalance ? "on" : "off"}.`,
      duplicate: "You already tried that value.",
      revealed: "Correct! A hidden node was revealed.",
      ghost: "That value was not hidden and was inserted as a ghost node.",
      won: "Congratulations! You revealed every hidden node.",
    },
    footer: {
      developedBy: "Built by:",
    },
  },
  es: {
    meta: {
      title: "Nodele",
      description: "Descubre los nodos ocultos del árbol binario.",
    },
    app: {
      title: "Nodele",
      intro: "Elige la dificultad para generar una partida aleatoria. Cuanta más dificultad, más nodos ocultos hay.",
      difficultyTitle: "Dificultad",
      settingsTitle: "Configuración de la partida",
      autoBalanceLabel: "Autoequilibrar árbol",
      autoBalanceHint: "Activado: el árbol se reorganiza después de cada jugada para quedar más equilibrado. Desactivado: la estructura crece de forma natural como BST.",
      autoBalanceAria: "Alternar autoequilibrio",
      autoBalanceInfo: "Explicación del autoequilibrio",
      languageLabel: "Idioma",
      startGame: "Iniciar partida",
      boardTitle: "Descubre los nodos ocultos del árbol binario.",
      remainingHidden: "ocultos restantes",
      autoBalanceOn: "activado",
      autoBalanceOff: "desactivado",
      gameSectionTitle: "Partida en curso",
      moveTitle: "Jugada",
      legendTitle: "Leyenda",
      controlsTitle: "Controles",
      newPhase: "Nueva ronda",
      menuInitial: "Menú inicial",
      difficulty: {
        easy: {
          label: "Fácil",
          hint: "Menos nodos ocultos para calentar.",
        },
        medium: {
          label: "Media",
          hint: "Equilibrada para partidas estándar.",
        },
        hard: {
          label: "Difícil",
          hint: "Más nodos ocultos y más margen para error.",
        },
        brutal: {
          label: "Brutal",
          hint: "Empieza con 8 nodos ocultos y ninguno visible.",
        },
      },
    },
    guessInput: {
      label: "Tu intento",
      placeholder: "Ex: 30",
      submit: "Insertar",
    },
    legend: {
      fixed: "Nodo sólido: valor oficial de la solución",
      hidden: "Nodo oculto: debe revelarse con el valor correcto",
      ghost: "Nodo fantasma: intento incorrecto insertado en el BST",
      allowedRange: (maxValue: number) => `Valores permitidos para intentar: de 1 a ${maxValue}.`,
      treeLogic: "Lógica del árbol: los valores menores que el nodo actual van a la izquierda, y los mayores a la derecha.",
    },
    tree: {
      exportImage: "Exportar imagen",
      exporting: "Exportando...",
      zoom: "Zoom",
      zoomOutAria: "Reducir zoom",
      zoomInAria: "Aumentar zoom",
      exportError: "No se pudo exportar la imagen del árbol.",
    },
    node: {
      hidden: "Nodo oculto",
      ghost: (label: string) => `Nodo fantasma ${label}`,
      fixed: (label: string) => `Nodo fijo ${label}`,
    },
    game: {
      initialMessage: (difficultyLabel: string, autoBalance: boolean) =>
        `Descubre los nodos ocultos. Dificultad: ${difficultyLabel}. Autoequilibrio: ${autoBalance ? "activado" : "desactivado"}.`,
      duplicate: "Ya probaste ese valor.",
      revealed: "¡Acierto! Se reveló un nodo oculto.",
      ghost: "Ese valor no estaba oculto y se insertó como nodo fantasma.",
      won: "¡Felicitaciones! Revelaste todos los nodos ocultos.",
    },
    footer: {
      developedBy: "Desarrollado por:",
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getHtmlLang(locale: Locale): string {
  return htmlLangByLocale[locale];
}

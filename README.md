# Nodele

Nodele é um jogo de lógica com foco em árvore binária de busca. O objetivo é descobrir os nós ocultos da árvore por meio de palpites, observando como cada valor se posiciona à esquerda ou à direita de acordo com a regra da BST.

![Demo do Nodele](demo.png)

## Como funciona

- Cada fase gera uma árvore binária com alguns nós ocultos.
- Ao digitar um valor, o jogo verifica se ele corresponde a um nó oculto.
- Valores menores que o nó atual seguem para a esquerda.
- Valores maiores que o nó atual seguem para a direita.
- Palpites errados entram como nós fantasmas para mostrar o caminho percorrido.

## Recursos

- Três níveis de dificuldade.
- Histórico de palpites.
- Visualização da árvore com zoom.
- Interface responsiva com visual personalizado.
- Legenda explicando os tipos de nós e a lógica da árvore.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

## Executando o projeto

### Pré-requisitos

- Node.js instalado
- npm instalado

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
npm run build
```

### Iniciar versão de produção

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Estrutura principal

- `app/` - layout global e página inicial
- `components/` - interface do jogo
- `lib/` - lógica da árvore, fases e estado do jogo
- `public/` - imagens e assets estáticos

## Internacionalização (i18n)

O projeto inclui suporte a múltiplos idiomas via um catálogo de traduções centralizado e um provedor de idioma React.

- Arquivo principal de traduções: `lib/i18n.ts` — contém as chaves de tradução, as abreviações/bandeiras e o `defaultLocale`.
- Provedor de idioma: `components/LanguageProvider.tsx` — persiste a preferência no `localStorage` (chave `nodele-locale`) e fornece o hook `useLanguage()` que expõe `locale`, `setLocale` e `t` (objeto de traduções).
- Onde está registado: `app/layout.tsx` — o `LanguageProvider` envolve a aplicação.

Idiomas inclusos por padrão: `pt` (Português), `en` (English), `es` (Español).

Como os componentes usam as traduções

- Nos componentes use o hook `useLanguage()` e acesse as strings via `t`, por exemplo `const { t } = useLanguage();` e `t.guessInput.placeholder`.
- Mensagens do jogo: a lógica de jogo (`lib/game.ts`) retorna objetos de mensagem (`types/game.ts`) com uma `key` (ex.: `{ key: "won" }`). A apresentação converte essas chaves em texto usando as traduções (`t.game.*`).

Como adicionar um novo idioma (ex.: `fr`)

1. Abra `lib/i18n.ts`.
2. Adicione a nova sigla ao array `locales`, por exemplo `locales.push('fr')`.
3. Adicione um objeto `translations.fr = { ... }` com todas as chaves usadas no projeto (siga a estrutura de `pt`, `en`, `es`).
4. Atualize `localeLabels` adicionando a abreviação e a bandeira que deseja mostrar no seletor (o projeto já usa apenas bandeira + abreviação).
5. Se novas chaves de mensagem do jogo forem necessárias, atualize `types/game.ts` e trate-as em `lib/game.ts` conforme necessário.
6. Reinicie o servidor de desenvolvimento (`npm run dev`) para testar.

Persistência e comportamento

- A preferência do usuário fica armazenada em `localStorage` com a chave `nodele-locale`.
- `defaultLocale` é definido em `lib/i18n.ts`; se nenhum idioma estiver salvo, o app usa esse valor.

Observações e próximos passos

- A abordagem atual é um catálogo interno (simples e leve). Para roteamento por local (ex.: `/pt`, `/en`) ou SEO com páginas estáticas por idioma, considere usar as features de internacionalização do Next.js ou bibliotecas como `next-intl`.
- Mantemos a separação entre lógica e apresentação: a lógica de jogo retorna chaves de mensagem, e as traduções ficam no catálogo.

## Licença

Projeto pessoal para estudo e experimentação com árvores binárias e interface de jogo.

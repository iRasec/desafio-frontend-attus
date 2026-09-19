# Desafio Front End — Listagem e Cadastro de Usuários

Aplicação Angular desenvolvida para o desafio técnico da Attus, reproduzindo
o protótipo de listagem de usuários com cadastro/edição em modal.

## Stack

- Angular 17 (standalone components, control flow `@if`/`@for`)
- Angular Material
- Signals (estado da tela de usuários) + NgRx (feature de exemplo `todo`, questão 3.2)
- RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`)
- Jest + jest-preset-angular (testes unitários)

## Instalação e execução

Pré-requisitos: Node.js 18+ e npm.

```bash
npm install
npm start          # abre em http://localhost:4200
```

## Testes

```bash
npm test              # roda a suíte com Jest
npm run test:coverage # roda com relatório de cobertura
```

A suíte cobre: `UsuarioService` (listar/criar/atualizar/erro), o formulário
de usuário (validações e preenchimento automático em edição), a listagem
(carregamento, debounce de busca, tratamento de erro, fluxo de criação via
dialog), a função genérica `filtrarEPaginar<T>`, o reducer NgRx da feature
`todo` e o componente `CartCounterComponent` baseado em Signals.

## Build de produção

```bash
npm run build
```

## Organização do código

```
src/app/
├── core/
│   ├── models/          # Usuario, Pagina/PaginaParams
│   ├── services/         # UsuarioService (API mockada em memória)
│   └── utils/            # filtrarEPaginar<T> (questão 1.2)
├── features/usuarios/
│   ├── usuario-list/         # tela de listagem (desafio 4.1)
│   └── usuario-form-dialog/  # modal de criação/edição (desafio 4.1)
├── state/todo/            # feature NgRx completa (questão 3.2) — actions,
│                           # reducer, selectors, effects
├── shared/cart-counter/   # componente de contador com Signals (questão 3.1)
├── app.config.ts
├── app.routes.ts
└── app.component.ts
```

## Decisões técnicas e onde encontrar cada requisito do desafio

- **1.1 Refatoração** e **2.1 Change Detection/OnPush**, **2.2 RxJS sem
  subscribe aninhado**: respondidas no documento `respostas-teoricas.md`
  (código comentado, sem necessidade de projeto rodando).
- **1.2 `filtrarEPaginar<T>`**: `src/app/core/utils/filtrar-e-paginar.ts`,
  totalmente tipada (sem `any`), com testes em
  `filtrar-e-paginar.spec.ts`.
- **2.3 Busca reativa com debounce**: implementada na própria tela de
  usuários (`usuario-list.component.ts`) — 300ms de debounce,
  `distinctUntilChanged`, `switchMap` (cancela requisição anterior),
  indicador de loading e limpeza de subscription via
  `takeUntilDestroyed`.
- **2.4 trackBy/OnPush**: discutido em `respostas-teoricas.md`; a listagem
  usa `@for (... track usuario.id)`, equivalente ao `trackBy` do `*ngFor`.
- **3.1 Signals**: `src/app/shared/cart-counter/cart-counter.component.ts`.
- **3.2 NgRx**: `src/app/state/todo/` (actions, reducer, selectors,
  effect com chamada HTTP mockada).
- **4. Desafio prático**: telas de listagem e modal em
  `src/app/features/usuarios/`, usando Signals para o estado da tela
  (a stack pedia "NgRx ou Signals"; a feature NgRx completa fica
  demonstrada separadamente em `state/todo` para a questão 3.2).

## Diferenciais não implementados

Por limitação de tempo, os seguintes diferenciais do item 4.3 **não** foram
implementados nesta entrega: Nx Monorepo, paginação na listagem e máscara/
validação de formato específica de CPF além do padrão via regex já presente
no formulário. Ficam registrados aqui como pontos de evolução.

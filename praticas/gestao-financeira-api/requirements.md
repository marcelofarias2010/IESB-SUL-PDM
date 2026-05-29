# Requisitos do Projeto — Gestão Financeira Full Stack

## Ferramentas Globais Necessárias

### Node.js
- **Versão mínima:** 18.x LTS
- **Download:** https://nodejs.org/en/download
- Verificar instalação:
  ```bash
  node -v
  npm -v
  ```

### Git
- **Download:** https://git-scm.com/downloads
- Verificar instalação:
  ```bash
  git --version
  ```

### Expo CLI
- Instalar globalmente após o Node.js:
  ```bash
  npm install -g expo-cli
  ```

---

## Backend — Dependências (`/backend`)

Instalar com:
```bash
cd backend
npm install
```

### Dependências de produção

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `@prisma/client` | ^5.14.0 | ORM para acesso ao banco de dados |
| `bcryptjs` | ^2.4.3 | Hash de senhas |
| `cors` | ^2.8.5 | Habilitar requisições cross-origin |
| `dotenv` | ^16.4.5 | Variáveis de ambiente |
| `express` | ^4.19.2 | Framework HTTP |
| `jsonwebtoken` | ^9.0.2 | Geração e validação de tokens JWT |
| `uuid` | ^10.0.0 | Geração de IDs únicos |
| `zod` | ^3.23.8 | Validação de schemas |

### Dependências de desenvolvimento

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `prisma` | ^5.14.0 | CLI do Prisma (migrations, seed) |
| `typescript` | ^5.4.5 | Suporte a TypeScript |
| `ts-node` | ^10.9.2 | Executar TypeScript direto |
| `ts-node-dev` | ^2.0.0 | Hot-reload em desenvolvimento |
| `@types/express` | ^4.17.21 | Tipos do Express |
| `@types/bcryptjs` | ^2.4.6 | Tipos do bcryptjs |
| `@types/jsonwebtoken` | ^9.0.6 | Tipos do JWT |
| `@types/cors` | ^2.8.17 | Tipos do cors |
| `@types/node` | ^20.14.2 | Tipos do Node.js |
| `@types/uuid` | ^10.0.0 | Tipos do uuid |

---

## Frontend — Dependências (`/frontend`)

Instalar com:
```bash
cd frontend
npm install
```

### Dependências de produção

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `expo` | ~51.0.14 | SDK principal do Expo |
| `expo-router` | ~3.5.14 | Navegação baseada em arquivos |
| `expo-constants` | ~16.0.2 | Constantes do ambiente Expo |
| `expo-font` | ~12.0.9 | Carregamento de fontes |
| `expo-linking` | ~6.3.1 | Deep linking |
| `expo-splash-screen` | ~0.27.5 | Tela de splash |
| `expo-status-bar` | ~1.12.1 | Controle da status bar |
| `react` | 18.2.0 | Biblioteca base React |
| `react-native` | 0.74.2 | Framework mobile |
| `react-native-paper` | ^5.12.3 | Componentes Material Design |
| `react-native-chart-kit` | ^6.12.0 | Gráficos (pizza, barras) |
| `react-native-svg` | 15.2.0 | Suporte a SVG (usado pelos gráficos) |
| `react-native-gesture-handler` | ~2.16.1 | Gestos e interações |
| `react-native-reanimated` | ~3.10.1 | Animações performáticas |
| `react-native-safe-area-context` | 4.10.1 | Áreas seguras (notch, etc.) |
| `react-native-screens` | 3.31.1 | Otimização de telas nativas |
| `@react-navigation/native` | ^6.1.17 | Navegação entre telas |
| `@react-native-async-storage/async-storage` | 1.23.1 | Persistência local |
| `@expo/vector-icons` | ^14.0.0 | Ícones MaterialCommunityIcons |
| `axios` | ^1.7.2 | Cliente HTTP |
| `react-hook-form` | ^7.52.0 | Gerenciamento de formulários |
| `@hookform/resolvers` | ^3.6.0 | Integração react-hook-form + zod |
| `zod` | ^3.23.8 | Validação de schemas |
| `date-fns` | ^3.6.0 | Manipulação de datas |

### Dependências de desenvolvimento

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `typescript` | ~5.3.3 | Suporte a TypeScript |
| `@babel/core` | ^7.24.0 | Compilador Babel |
| `@types/react` | ~18.2.45 | Tipos do React |

---

## Banco de Dados

- **SQLite** — já embutido no sistema operacional (não requer instalação separada)
- Gerenciado pelo Prisma ORM

---

## Opcional — Ferramentas de Apoio

| Ferramenta | Finalidade | Link |
|------------|------------|------|
| Prisma Studio | Interface visual para o banco de dados | via `npx prisma studio` |
| DB Browser for SQLite | Abrir o arquivo `.db` graficamente | https://sqlitebrowser.org |
| Postman | Testar os endpoints da API | https://www.postman.com/downloads |
| Android Studio | Emulador Android | https://developer.android.com/studio |

---

## Versões do Ambiente de Desenvolvimento Recomendadas

| Ferramenta | Versão recomendada |
|------------|--------------------|
| Node.js | 20.x LTS |
| npm | 10.x |
| Java JDK (Android Studio) | 17 |
| Android SDK | API 34 (Android 14) |


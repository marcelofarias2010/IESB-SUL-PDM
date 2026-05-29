# 💰 Gestão Financeira — Full Stack App

Aplicação completa de gestão financeira mobile com React Native (Expo) e Node.js.

---

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── postman/
│   │   └── collection.json
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   └── transaction.controller.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   └── transaction.routes.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   ├── category.validator.ts
│   │   │   └── transaction.validator.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── auth/
    │   │   ├── _layout.tsx
    │   │   └── login.tsx
    │   ├── tabs/
    │   │   ├── _layout.tsx
    │   │   ├── home.tsx
    │   │   ├── transactions.tsx
    │   │   ├── summary.tsx
    │   │   └── categories.tsx
    │   ├── _layout.tsx
    │   └── index.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── services/
    │   ├── api.ts
    │   ├── auth.service.ts
    │   ├── category.service.ts
    │   └── transaction.service.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   ├── format.ts
    │   └── theme.ts
    ├── app.json
    ├── babel.config.js
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go no celular (opcional)

---

## ⚙️ Backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar o banco de dados

O arquivo `.env` já está configurado para SQLite em desenvolvimento:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="gestao_financeira_secret_key_2024"
PORT=3000
```

### 3. Gerar o Prisma Client

```bash
npm run db:generate
```

### 4. Criar o banco de dados (migração)

```bash
npm run db:push
```

### 5. Executar o Seed

Popula o banco com o usuário padrão e as 5 categorias iniciais:

```bash
npm run seed
```

**Dados inseridos:**

| Campo | Valor |
|-------|-------|
| Email | admin@admin.com |
| Senha | 123456 |
| Nome  | Administrador |

**Categorias inseridas:**
- 💰 Receita (isIncome: true)
- 🍔 Alimentação
- 🚗 Transporte
- 🏠 Moradia
- 🎮 Lazer

### 6. Iniciar o servidor

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor iniciará em: **http://localhost:3000**

---

## 📱 Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Configurar a URL da API

Edite `services/api.ts` e ajuste a URL conforme seu ambiente:

- **Web/iOS Simulator:** `http://localhost:3000`
- **Android Emulator:** `http://10.0.2.2:3000`  
- **Dispositivo físico:** use o IP da sua máquina (ex: `http://192.168.1.100:3000`)

### 3. Iniciar o Expo

```bash
# Todos os targets
npm start

# Web
npm run web

# Android
npm run android

# iOS
npm run ios
```

---

## 🧪 Testes com Postman

### Importar a coleção

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo: `backend/postman/collection.json`
4. A coleção **"Gestão Financeira API"** será importada

### Variáveis configuradas

| Variável | Valor padrão |
|----------|-------------|
| `baseUrl` | `http://localhost:3000` |
| `token`   | _(preenchido automaticamente após login)_ |

### Fluxo de teste recomendado

1. **Health Check** — verifica se a API está no ar
2. **Login** — obtém o token JWT (salvo automaticamente)
3. **Listar Categorias** — usa o token automaticamente
4. **Criar Categoria** — teste de criação
5. **Criar Transação** — substitua `CATEGORY_ID_AQUI` pelo ID de uma categoria
6. **Listar Transações** — lista com categoria expandida

---

## 📡 Endpoints da API

### Health Check
```
GET /
```

### Autenticação
```
POST /auth/login
Body: { "email": "admin@admin.com", "password": "123456" }
```

### Categorias (requer JWT)
```
GET    /categories
POST   /categories
PUT    /categories/:id
DELETE /categories/:id
```

### Transações (requer JWT)
```
GET    /transactions?month=6&year=2024
POST   /transactions
PUT    /transactions/:id
DELETE /transactions/:id
```

---

## 🔐 Autenticação

Todas as rotas (exceto `/` e `/auth/login`) requerem o header:

```
Authorization: Bearer <token>
```

O token JWT tem validade de **7 dias**.

---

## 📱 Funcionalidades do App

| Tela | Funcionalidades |
|------|----------------|
| **Login** | Autenticação com email/senha, validação, persistência de sessão |
| **Home** | Boas-vindas, saldo, receitas/despesas do mês, transações recentes |
| **Transações** | Lista com filtro por mês/ano, criar, editar (long press), excluir |
| **Resumo** | Gráfico de pizza (despesas por categoria), barras (receitas vs despesas) |
| **Categorias** | Listar, criar com ícone/cor, editar, excluir (padrões protegidas) |

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js + TypeScript** — runtime e linguagem
- **Express** — framework HTTP
- **Prisma** — ORM
- **SQLite** — banco de dados (desenvolvimento)
- **JWT** — autenticação
- **Bcrypt** — hash de senha
- **Zod** — validação de schemas

### Frontend
- **React Native + Expo** — framework mobile
- **Expo Router** — navegação baseada em arquivos
- **React Hook Form + Zod** — formulários com validação
- **React Native Paper** — componentes de UI (Material Design)
- **React Native Chart Kit** — gráficos
- **Axios** — cliente HTTP com interceptadores
- **AsyncStorage** — persistência local
- **Date-fns** — manipulação de datas

---

## ⚠️ Solução de Problemas

### Backend não conecta
- Verifique se rodou `npm run db:push` e `npm run seed`
- Confira o arquivo `.env`

### App não conecta ao backend
- No Android Emulator, use `http://10.0.2.2:3000` em vez de `localhost`
- No dispositivo físico, use o IP da máquina na rede local
- Verifique se o backend está rodando

### Erro de token expirado
- Faça logout e login novamente no app
- O token tem validade de 7 dias

# 💰 App de Gestão Financeira

Projeto acadêmico de desenvolvimento mobile (PDM - IESB) focado na criação de um aplicativo para controle financeiro pessoal. O aplicativo permite que o usuário gerencie suas receitas e despesas, visualize relatórios dinâmicos através de gráficos, filtre transações por mês e ano, e realize o gerenciamento de sua conta de forma local.

---

# 🚀 O que foi feito

O projeto consistiu em desenvolver a interface e a lógica de estado de um aplicativo React Native utilizando Expo Router para navegação por abas (Tabs) e pilhas (Stacks). Foi implementado um sistema de "banco de dados em memória" utilizando a **Context API** do React (`GlobalState`), permitindo que os dados (usuários logados, categorias e transações com IDs únicos) transitem entre as telas sem a necessidade de um backend externo nesta etapa.

## Principais funcionalidades implementadas

* Sistema de Cadastro e Login (validação local em memória).
* Dashboard (Início) com listagem de transações, saudação com o nome do usuário logado e opção de exclusão (lixeira).
* Filtros dinâmicos por mês e ano.
* Tela de Resumo com cálculo matemático automático de Receitas, Despesas e Saldo.
* Gráfico de Pizza segmentado dinamicamente pelas categorias de despesas.

---

# 🛠️ Tecnologias e Bibliotecas Utilizadas

* **React Native** e **Expo**: Frameworks base para a construção do aplicativo.
* **Expo Router**: Sistema de roteamento baseado em arquivos (File-based routing).
* **React Context API**: Gerenciamento de estado global da aplicação.
* **React Native Chart Kit** e **React Native SVG**: Renderização do gráfico de pizza animado na tela de Resumo.
* **Expo Google Fonts** (`@expo-google-fonts/poppins` e `expo-font`): Configuração e carregamento da tipografia personalizada (Poppins) em toda a interface.
* **Expo Vector Icons (Ionicons)**: Ícones da interface gráfica.

---

# 💻 Passo a Passo para Instalação e Execução

Para rodar o projeto localmente e avaliar o aplicativo, siga os passos abaixo no terminal da sua máquina:

## 1. Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

---

## 2. Clone o repositório e acesse a pasta do projeto

Abra o terminal na pasta raiz do projeto (`gestao-financeira`).

---

## 3. Instalando as dependências base

```bash
npm install
```

---

## 4. Instalando as bibliotecas de Fontes e Gráficos

Para garantir que as fontes personalizadas e o gráfico de pizza funcionem corretamente, instale os pacotes do Expo:

```bash
npx expo install expo-font @expo-google-fonts/poppins
npx expo install react-native-chart-kit react-native-svg @react-native-community/datetimepicker
```

---

## 5. Verificação do app.json

Certifique-se de que o arquivo `app.json` possui o pacote Android configurado corretamente para que o emulador consiga identificar o app:

```json
"android": {
  "package": "com.seu_nome.gestaofinanceira"
}
```

---

## 6. Iniciando o aplicativo (Limpando o cache)

Para rodar o servidor do Expo e evitar falhas de memória ou travamentos no emulador, inicie com a flag `-c`:

```bash
npx expo start -c
```

---

## 7. Abrindo no Emulador ou Celular

### No Emulador Android

Com o Android Studio aberto e o emulador rodando, pressione a tecla `a` no terminal.

Se ocorrer recusa de porta (`TCP 5554`), faça um **Cold Boot** no emulador pelo Android Studio e tente novamente.

### No Celular Físico

Baixe o app **Expo Go** (Android/iOS), conecte na mesma rede Wi-Fi do computador e escaneie o QR Code que aparece no terminal.

---

# 🧪 Modelos de Teste e Respostas Esperadas do Sistema

Abaixo estão os cenários de teste configurados no aplicativo para validar os requisitos solicitados pelo professor.

---

# ✅ Teste 1: Autenticação (Cadastro e Login)

## Ação

Na tela de Login, clicar em **"Solicitar cadastro"**.

Preencher:

* nome;
* e-mail sem `@`;
* ou senha com menos de 6 caracteres;

e tentar concluir.

## Resposta Esperada

O sistema deve bloquear a ação e exibir um aviso em vermelho informando a regra violada.

---

## Ação

Preencher corretamente:

* Nome: `Marcos`
* E-mail: `teste@teste.com`
* Senha: `123456`

Realizar o cadastro e depois fazer login com estas credenciais.

## Resposta Esperada

O sistema exibe:

```txt
Cadastro realizado com sucesso
```

Depois retorna à tela de login e, ao entrar, navega para a tela **Início** exibindo a saudação personalizada:

```txt
Olá, Marcos!
```

---

# ✅ Teste 2: Adição e Listagem de Transação

## Ação

Entrar na aba **Adicionar** (botão `+`), selecionar a categoria **Moradia**, inserir o valor:

```txt
900.00
```

Adicionar uma descrição:

```txt
Aluguel
```

e salvar.

## Resposta Esperada

O app deve retornar para a tela **Início** e a nova transação deve aparecer na lista na cor correspondente:

* vermelho para despesa;
* com o sinal `-`.

---

# ✅ Teste 3: Cálculo, Separação de Receitas/Despesas e Gráfico

## Ação

Adicionar uma transação do tipo Receita/Saldo:

* Categoria: `Salário`
* Valor: `2000.00`

Depois acessar a aba **Resumo**.

## Resposta Esperada

O sistema deve separar matematicamente as entradas e saídas.

A tela mostrará:

```txt
Receitas: R$ 2000.00
Despesas: R$ 900.00
Saldo do período: R$ 1100.00
```

O saldo deve aparecer na cor verde.

---

## Ação Visual

O Gráfico de Pizza deve ser renderizado mostrando apenas a fatia de:

```txt
Moradia
```

(Despesas), ignorando a transação de Salário, validando a lógica de filtragem do gráfico.

---

# ✅ Teste 4: Exclusão de Transação (Lixeira)

## Ação

Na aba **Início**, clicar no ícone de lixeira ao lado da transação de:

```txt
Aluguel
```

## Resposta Esperada

A transação deve desaparecer imediatamente da lista.

Ao acessar a aba **Resumo**:

```txt
Despesas: R$ 0.00
```

e o Gráfico de Pizza deve exibir a mensagem:

```txt
Sem despesas neste período
```

---

# ✅ Teste 5: Filtros de Mês e Ano

## Ação

Na aba **Início**, alterar o "Pill" de seleção do mês atual:

```txt
Mai
```

para um mês sem lançamentos:

```txt
Jun
```

## Resposta Esperada

A lista de transações deve ficar completamente vazia e exibir o texto:

```txt
Nenhuma transação encontrada
```

comprovando que as listagens respeitam os filtros de data e ano.


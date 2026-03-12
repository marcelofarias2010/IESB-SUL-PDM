# 💻 Aula 08: Gerando o Aplicativo Final (Build com EAS) e Distribuição

Até o momento, nosso aplicativo só funciona se o nosso computador estiver ligado e conectado pelo Expo Go. Mas como fazemos para gerar o arquivo final do aplicativo e enviar para outras pessoas instalarem? 

Nesta aula, vamos usar o **EAS (Expo Application Services)** para compilar nosso código nas nuvens e gerar um arquivo instalável (`.apk`) para Android!

## 🎯 Objetivos da Aula
* Entender a diferença entre *Development Build*, *Internal Distribution* e *Production Build*.
* Criar uma conta no portal da Expo.
* Instalar o `eas-cli` globalmente e o `expo-dev-client` no projeto.
* Vincular o projeto local ao projeto na nuvem (resolvendo conflitos de ID).
* Configurar o arquivo `eas.json` para gerar um arquivo `.apk`.
* Realizar o build do aplicativo na nuvem.
* Baixar, instalar e testar o app nativo no smartphone.

---

## ☁️ Passo 1: Conta na Expo e Instalação do EAS CLI
Para que a Expo compile o aplicativo nos servidores deles (o que é ótimo, pois não exige um computador potente), precisamos de uma conta e da ferramenta de linha de comando.

1. **Crie sua conta:** Acesse [expo.dev](https://expo.dev) e crie uma conta gratuita.
2. **Instale o EAS CLI:** Abra o seu terminal e instale a ferramenta globalmente na sua máquina:
   ```bash
   npm install -g eas-cli
   ```
*(Pode ignorar os avisos amarelos de npm warn deprecated, é normal!)*
3. **Faça o Login:** No terminal, acesse sua conta:
```bash
eas login
```
*(Insira o e-mail e a senha que você acabou de criar).*

## 🔗 Passo 2: Instalação do Dev Client e Vinculação (`O eas init`)
Navegue até a pasta do seu projeto (`cd gestao-financeira`) no terminal.

Primeiro, precisamos instalar o pacote cliente de desenvolvimento do Expo:
```bash
npx expo install expo-dev-client
```
Agora, vamos vincular o nosso projeto local com a nuvem do Expo rodando:
```bash
eas init
```
⚠️ **Solução de Problemas Clássicos (Troubleshooting):**
Se ao rodar eas init você receber um erro como:
`Error: GraphQL request failed. Experience with id 'XXX' does not exist.`

Isso acontece porque o `app.json` pode estar tentando usar um projeto antigo. Para forçar a vinculação com um ID específico (caso você tenha criado o projeto no painel web do Expo) ou para sobrescrever, use:
```bash
eas init --id SEU-ID-AQUI
```
Ele perguntará se você deseja sobrescrever o "owner" e o "slug". Responda `yes` para ambos.
## 📝 Passo 3: Configuração do Build (`eas build:configure`)
Para dizer à nuvem como construir nosso app, precisamos gerar um arquivo de configuração. Rode:
```bash
eas build:configure
```
O terminal perguntará: `Which platforms would you like to configure for EAS Build?`. Use as setas do teclado para selecionar `All` (Todas) e dê Enter.

Isso criará o arquivo `eas.json` na raiz do seu projeto.

**Alteração Importante para gerar APK:**
Abra o `eas.json` que acabou de ser criado. Precisamos adicionar o bloco `preview` para forçar a geração de um `.apk` (instalável direto no celular), e não de um `.aab` (formato de loja). Deixe-o assim:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```
## 🚀 Passo 4: Rodando o Build na Nuvem
Com tudo configurado e vinculado, vamos mandar o nosso código para a nuvem da Expo compilar usando o perfil `preview` que acabamos de configurar:
```bash
eas build --platform android --profile preview
```
**O que vai acontecer no terminal?**

1. O EAS vai perguntar o ID do seu aplicativo Android (`What would you like your Android application id to be?`). Ele vai sugerir algo como `com.seuusuario.money`. Aperte Enter para confirmar.
2. Ele perguntará se você deseja gerar uma nova *Android Keystore* (uma chave de segurança do seu app). Digite `Y`(**Yes**).
3. Ele vai compactar seu projeto e enviar para a fila de compilação.
4. **Pausa para o café ☕**: Como estamos no plano gratuito, o processo entrará em uma fila. Pode levar de **10 a 25 minutos**. Acompanhe o progresso pelo link do painel exibido no terminal.

## 📱 Passo 5: Instalando no Celular
Quando o build terminar (mensagem de *Build Finished*), o terminal exibirá um **QR Code** gigante e um link.
1. Abra a câmera do seu celular Android e escaneie o QR Code (ou digite o link no navegador do celular).
2. Ele fará o download do arquivo `.apk`.
3. Toque para instalar.
(*O Android pedirá para você permitir a "Instalação de aplicativos de fontes desconhecidas" em Configurações. Permita!*)
4. Abra o aplicativo e veja sua criação rodando nativamente e offline!

## 📚 Referências de Estudo
Caso queira se aprofundar nos tipos de build do EAS, consulte a documentação oficial:

* [Configurando Builds de Desenvolvimento](https://docs.expo.dev/tutorial/eas/configure-development-build/)
* [Development Build para Android](https://docs.expo.dev/tutorial/eas/android-development-build/)
* [Development Build para iOS (Dispositivos Físicos)](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)
* [Builds de Distribuição Interna (O arquivo .apk / .tar.gz)](https://docs.expo.dev/tutorial/eas/internal-distribution-builds/)

✅ **Conclusão do Módulo**
Parabéns! 🎉 Você concluiu a jornada de desenvolvimento mobile! Criamos um projeto do zero, estruturamos telas, estilizamos, manipulamos estados globais, salvamos dados na memória do aparelho e, finalmente, geramos um aplicativo instalável.
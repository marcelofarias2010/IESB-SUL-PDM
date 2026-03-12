# 💻 Aula 08: Gerando o Aplicativo Final (Build com EAS) e Distribuição

Até o momento, nosso aplicativo só funciona se o nosso computador estiver ligado, com o terminal rodando e conectados pelo Expo Go. Mas como fazemos para gerar o arquivo final do aplicativo e enviar para outras pessoas instalarem? 

Nesta aula, vamos usar o **EAS (Expo Application Services)** para compilar nosso código nas nuvens e gerar um arquivo instalável (`.apk`) para Android!

## 🎯 Objetivos da Aula
* Entender a diferença entre *Development Build*, *Internal Distribution* e *Production Build*.
* Criar uma conta gratuita no portal da Expo.
* Instalar e configurar o `eas-cli` no projeto.
* Configurar o arquivo `eas.json` para gerar um arquivo APK.
* Realizar o build do aplicativo na nuvem.
* Baixar, instalar e testar o app nativo no próprio smartphone.

---

## ☁️ Passo 1: Preparando o Terreno (Conta e CLI)
Para que a Expo compile o aplicativo nos servidores deles (o que é ótimo, pois não exige um computador potente ou um Mac da nossa parte), precisamos de uma conta e da ferramenta de linha de comando.

1. **Crie sua conta:** Acesse [expo.dev](https://expo.dev) e crie uma conta gratuita.
2. **Instale o EAS CLI:** No seu terminal (pode ser fora da pasta do projeto), instale a ferramenta globalmente:
   ```bash
   npm install -g eas-cli
   ```
3. **Faça o Login:** No terminal, digite o comando abaixo e insira o e-mail e senha da conta que você acabou de criar:
```bash
eas login
```
## ⚙️ Passo 2: Inicializando o EAS no Projeto
Agora, navegue até a pasta do seu projeto (`gestao-financeira` ou `Money`) no terminal e digite:
```bash
eas init
```
O terminal vai perguntar qual é o ID do projeto ou se deseja vinculá-lo à sua conta da Expo. Confirme as opções. Esse comando criará um arquivo muito importante na raiz do seu projeto chamado `eas.json`.

## 📝 Passo 3: Configurando o `eas.json` para gerar um APK
Por padrão, se mandarmos a Expo fazer um build de produção para Android, ela vai gerar um arquivo `.aab` (Android App Bundle), que é o formato exigido pela Google Play Store, mas que **não pode ser instalado diretamente no celular**.

Como queremos um arquivo para "Distribuição Interna" (para instalar via download/QR Code), precisamos dizer para a Expo gerar um `.apk`.

Abra o arquivo `eas.json` e adicione o perfil `preview` dentro da seção `build`, especificando o `buildType`:

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
Chegou o grande momento! Com tudo configurado, vamos mandar o nosso código para os servidores da Expo compilarem o nosso APK.

No terminal, execute o comando usando o perfil (`profile`) que acabamos de configurar:
```bash
eas build -p android --profile preview
```

**O que vai acontecer agora?**

1. O EAS vai perguntar se você deseja gerar uma nova Android Keystore (uma chave de segurança criptografada do seu app). Digite Y (Yes).
2. Ele vai compactar seu projeto e enviar para a fila de compilação na nuvem.
3. **Pausa para o café:** Como estamos usando o plano gratuito da Expo, o build entra em uma fila. Esse processo pode levar de **10 a 25 minutos**. Você pode acompanhar o progresso pelo link do painel que aparecerá no seu terminal.

## 📱 Passo 5: Instalando no Celular
Quando o build terminar (mensagem de *Build Finished*), o seu terminal exibirá um **QR Code** gigante e um link.

1. Abra a câmera do seu celular Android e escaneie o QR Code (ou abra o link no navegador do celular).
2. Ele fará o download de um arquivo final `.apk`.
3. Toque para instalar.

- *Atenção*: O Android bloqueará a instalação inicialmente por segurança. Você precisará ir em Configurações e permitir a **"Instalação de aplicativos de fontes desconhecidas"**.
4. Abra o aplicativo!

### 📚 Entendendo os Tipos de Build (Teoria)
- **Development Build:** Um "Expo Go personalizado". Você instala no celular, mas ainda precisa do terminal rodando (`npx expo start`) para ele funcionar. Usado para testar bibliotecas nativas complexas.
- **Internal Distribution (Preview):** O que fizemos agora! Gera um `.apk` que funciona 100% offline, sem depender do seu computador. Perfeito para portfólio, testes da equipe e enviar para os amigos.
- **Production Build:** O build final. Para subir esse build na Apple App Store ou na Google Play Store, você precisará pagar as taxas de desenvolvedor (US$ 99/ano para Apple e taxa única de US$ 25 para o Google). O EAS também tem ferramentas automáticas (`eas submit`) para enviar direto para as lojas quando você tiver essas contas!

### ✅ Conclusão do Módulo
Parabéns! 🎉 Você concluiu a jornada de desenvolvimento mobile! Criamos um projeto do zero, estruturamos telas, estilizamos, manipulamos estados globais, salvamos dados na memória do aparelho e, finalmente, geramos um aplicativo instalável de verdade.

Agora você tem uma base sólida para criar seus próprios aplicativos usando React Native e Expo!

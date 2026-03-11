# 💻 Aula 02: Layout e Estado do Formulário (Adicionar Transações)

Dando continuidade ao nosso aplicativo **Money**, nesta aula vamos focar na aba do meio: a tela de **Adicionar Transações**. O objetivo aqui é desenhar a interface, criar inputs para os dados e conectar tudo isso a um estado (`useState`) inteligente para gerenciar o formulário.

## 🎯 Objetivos da Aula
* Adicionar o ícone do aplicativo no `app.json`.
* Criar a estrutura base da tela de Adicionar Transações (Inputs e Botão).
* Criar um arquivo de estilos globais (`GlobalStyles.js`) para reaproveitamento de código.
* Componentizar o botão principal da aplicação.
* Gerenciar o estado de múltiplos inputs usando um único `useState` contendo um objeto.

## 📱 Passo 1: Configurando o Ícone do App
Antes de codar a tela, vamos deixar nosso app com cara de app profissional! 
Abra o arquivo `app.json` (na raiz do projeto) e localize as configurações de ícone e splash screen. Substitua os caminhos pelas imagens que você disponibilizou na pasta de `assets`:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png"
    }
  }
}
```
*Atenção: Para que o ícone atualize no Expo Go, geralmente é necessário parar o servidor no terminal (`Ctrl+C`) e rodar novamente (`npm run android`).*

## 🏗️ Passo 2: Estrutura Base e Estilos Globais
Na tela `AddTransactions.jsx`, vamos precisar de quatro campos: Descrição, Valor, Data e Categoria. Para que as telas fiquem padronizadas, vamos criar uma pasta `styles/` na raiz e dentro dela o arquivo `globalStyles.js`.

Criando o `globalStyles.js`:
```js
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors'; // Ajuste o caminho conforme seu projeto

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    fontWeight: 'bold',
  }
});
```
**Por que usar `padding` na ScrollView?**
Ao invés de usar `margin`, usamos `paddingHorizontal` na nossa `<ScrollView>`. Se usássemos margem, a barra de rolagem visual do celular ficaria "descolada" da borda da tela. O `padding` garante que o conteúdo afaste, mas a barra de rolagem continue encostada no canto!

## 🔘 Passo 3: Componentizando o Botão
Em vez de criar um botão do zero em cada tela, vamos criar um componente reutilizável.
Crie o arquivo `components/Button.jsx`:

```javascript
import { TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function Button({ children, onPress }) {
  return (
    <TouchableHighlight style={styles.button} onPress={onPress} underlayColor={Colors.primaryDark}>
      <Text style={styles.text}>{children}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
```
## 🧠 Passo 4: O Estado Centralizado (O pulo do gato!)
Geralmente, criamos um `useState` para cada input (`const [descricao, setDescricao] = useState('')`). Mas como temos 4 campos, isso pode ficar confuso. Vamos aprender uma técnica avançada: um único estado com um objeto dentro!

No arquivo `AddTransactions.jsx`:

```jsx
import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';

export default function AddTransactions() {
  // Estado inicial como um objeto
  const [form, setForm] = useState({
    description: '',
    value: '',
    date: '',
    category: 'Renda'
  });

  const handleAddTransaction = () => {
    Alert.alert("Dados Salvos!", `Desc: ${form.description} \nValor: ${form.value}`);
  };

  return (
    <ScrollView style={globalStyles.screenContainer} contentContainerStyle={globalStyles.content}>
      
      {/* Campo Descrição */}
      <View>
        <Text style={globalStyles.inputLabel}>Descrição</Text>
        <TextInput 
          style={globalStyles.input}
          value={form.description}
          // Usamos o Spread Operator (...) para copiar o form antigo e alterar só a description!
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
      </View>

      {/* Campo Valor */}
      <View>
        <Text style={globalStyles.inputLabel}>Valor</Text>
        <TextInput 
          style={globalStyles.input}
          keyboardType="numeric" // Teclado de números!
          value={form.value}
          onChangeText={(text) => setForm({ ...form, value: text })}
        />
      </View>

      {/* Adicione os campos Data e Categoria de forma similar... */}

      <View style={{ marginTop: 30 }}>
        <Button title="Adicionar" onPress={handleAddTransaction} />
      </View>

    </ScrollView>
  );
}
```
✅ **O que alcançamos hoje?**
Nossa tela de adição já tem cara de formulário real! Aprendemos a criar estilos globais para padronizar o app, criamos um botão customizado e, o mais importante, aprendemos a gerenciar um formulário inteiro usando um único estado do React.

**Próximo Passo:** Por enquanto, Data e Categoria são apenas campos de texto normais. Na próxima aula, vamos evoluir isso introduzindo um **DatePicker** e um **Dropdown** de verdade!
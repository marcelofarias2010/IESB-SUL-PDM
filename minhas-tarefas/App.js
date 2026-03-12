import { TextInput } from "react-native-web";
import { titulo } from "./util";
import { titulo_padrao } from "./util";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App(){
    return(
        <View style={styles.container}>
            <View>
                <text>Teste</text>
                <TextInput placeholder="Digite sua meta"/>
            </View>
            <View>
                <Button title="Cadrastar a Meta"/>
            </View>
            <Text>{titulo}</Text>
            <Text style={{margin:20}}>{titulo_padrao}</Text>
            <Text style={styles.text}>AAA</Text>
            <Button title="Clique aqui"/>
            <StatusBar style="auto"/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        margin: 20,
    }
});
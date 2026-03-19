import { StyleSheet, TextInput, Button, View } from "react-native";
import React, { useState } from 'react';
import { btn_cadastro_meta, rotulo_input_meta } from '../mensagens'; 
import { StyleSheet } from 'react-native';

function MetaInput(props) {
    const [inputMetaText, setInputMetaText] = useState('');

    function metaInputHandLer(inputText) {
        setInputMetaText(inputText);
    };

    function addMetaHandler() {
        props.onAddMeta(inputMetaText); 
        setInputMetaText(''); 
    }

    return (
        <View style={styles.inputContainer}>
            <View style={{ width: '65%' }}> 
                <TextInput 
                    style={styles.inputText}
                    placeholder={rotulo_input_meta}
                    onChangeText={metaInputHandLer}
                    value={inputMetaText}
                />
            </View>
            <View style={{ width: '30%' }}>
                <Button 
                    title={btn_cadastro_meta} 
                    onPress={addMetaHandler} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    inputText: {
        borderColor: '#cccccc',
        borderWidth: 1,
        padding: 8
    },
});

export default MetaInput;
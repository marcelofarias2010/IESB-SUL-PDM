import React, { useState } from 'react';
import { StyleSheet, View, MetaInput } from 'react-native';
import { StyleSheet } from 'react-native';
import MetaInput from './components/MetaInput';
import MetaList from './components/MetaList';

export default function App() {
    const [metas, setMetas] = useState([]); 

    function adicionarMetaHandler(textoDaMeta) {
        // Usa o operador spread para manter as metas antigas e adicionar a nova [cite: 71, 542]
        setMetas((metasAtuais) => [...metasAtuais, textoDaMeta]);
    }

    return (
        <View style={styles.mainContainer}>
            <MetaInput onAddMeta={adicionarMetaHandler} />
            <View style={styles.metaContainer}>
                <MetaList array={metas} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 50,
        flex: 1
    },
    metaContainer: {
        flex: 10 
    }
});
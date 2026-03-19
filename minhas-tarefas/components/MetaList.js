import { ScrollView, Text, StyleSheet } from "react-native";
import React from 'react';
import { StyleSheet } from 'react-native';

function MetaList(props) {
    return (
        <ScrollView>
            {props.array.map((meta, index) => (
                <Text key={index} style={styles.item}>
                    {meta}
                </Text>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    item: {
        margin: 8,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'lightblue',
    }
});

export default MetaList;
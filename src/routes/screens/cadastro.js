import React from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";

const Cadastro = ({navigation}) =>{
    return(
        <View style={styles.conteiner}>
            <Text>Cadastro</Text>
            <TextInput style={styles.textinput} placeholder="Email:"></TextInput>
            <TextInput style={styles.textinput} placeholder="Nome:"></TextInput>
            <TextInput style={styles.textinput} placeholder="Senha:"></TextInput>
            <TouchableOpacity onPress={() => navigation.navigate('LOGIN')}>
                <Text>Cadastro</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    conteiner:{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinput:{
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 2,
        width: 200,
    },
    text:{
        position: 'absolute'
    }
})

export default Cadastro;



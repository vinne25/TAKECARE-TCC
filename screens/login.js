import React from "react";
import { View,Text, TouchableOpacity } from "react-native";
import styles from "./style";

const LOGIN = ({navigation}) =>{
    return(
        <View>
            <Text>Olá </Text>
        <TouchableOpacity
        onPress={() => navigation.navigate('pesquisar')}>
        <Text>Continuar</Text>
        </TouchableOpacity>
        </View>
    )
};

export default LOGIN;
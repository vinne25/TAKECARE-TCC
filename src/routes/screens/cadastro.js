import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

const Cadastro = ({navigation}) =>{
    return(
        <View>
            <Text>Cadastro</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LOGIN')}>
                <Text>Cadastro</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Cadastro;
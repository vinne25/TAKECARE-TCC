import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';


const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function signIn() {
        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                navigation.navigate('TabRoutes')
                console.log('usuário logado!')
            })
            .catch(error => console.log(error));
    }

    return (
        <View style={styles.conteiner}>
            <Image
                source={require('../../../assets/Imagem/logotk.png')}
                style={{ width: '100%', height: '13%', bottom: '27%' }}
                resizeMode="contain"
            />
            <Text>Login</Text>
            <TextInput style={styles.textinput} placeholder="Email" onChangeText={setEmail}></TextInput>
            <TextInput style={styles.textinput} placeholder="Senha" onChangeText={setPassword} secureTextEntry></TextInput>
            <Text>Ainda não possui um login?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text>Cadastre-se</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signIn}>
                <Text>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinput: {
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 2,
        width: 200,
        alignSelf: 'center'
    },
    text: {
        position: 'absolute'
    }
})

export default Login;
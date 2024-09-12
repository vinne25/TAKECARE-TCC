import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, SafeAreaView } from "react-native";
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
                source={require('../../../assets/Imagem/logo.png')}
                style={{ width: '100%', height: '13%', bottom: '17%' }}
                resizeMode="contain"
            />
            <SafeAreaView style={styles.arealg}>
            <Text style={styles.txtlg}>Login</Text>

            <Text style={styles.EeS}>E-mail</Text>
            <TextInput style={styles.inputE}  onChangeText={setEmail}></TextInput>

            <Text style={styles.EeS}>Senha</Text>
            <TextInput style={styles.inputS}  onChangeText={setPassword} secureTextEntry></TextInput>

            <Text style={styles.anpl}>Ainda não possui um login?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.txtcd}>Cadastre-se</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btentrar} onPress={signIn}>
                <Text style={styles.txtent}>Entrar</Text>
            </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    arealg:{
        bottom: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: '45%',
        width:'70%'
    },

    txtlg:{
        fontWeight:'bold',
        color: 'black',
        fontSize: 20,
        marginBottom: '10%'
    },

    EeS:{
        fontWeight: 'bold',
        color: 'black',
        right: '38%',
        top: '2%'
    },

    anpl:{
        fontSize: 12,
        right: '14%',
        color: 'black'
    },

    txtcd:{
        position:'absolute',
        left:'18%',
        fontSize: 12,
        bottom: '10%',
        color: 'black'
    },

    inputE: {
        borderBottomWidth: 2,
        width: '95%',
        alignSelf: 'center',
        marginBottom: '8%'
    },

    inputS: {
        borderBottomWidth: 2,
        width: '95%',
        alignSelf: 'center',
        marginBottom: '3%'
    },

    btentrar: {
        backgroundColor: 'cyan',
        borderRadius: 100,
        width: '60%',
        height: '10%',
        top: '15%'
    },

    txtent:{
        top: '15%',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'black',
    }
})

export default Login;
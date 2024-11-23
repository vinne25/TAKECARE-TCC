import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function signIn() {
        if (email === '' || password === '') {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);
        auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false);
                navigation.navigate('TabRoutes');
                console.log('Usuário logado!');
            })
            .catch(error => {
                setLoading(false);
                Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
                console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/Imagem/logotk.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <SafeAreaView style={styles.loginArea}>
                <Text style={styles.title}>Login</Text>

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />

                <Text style={styles.prompt}>Ainda não possui um login?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.signup}>Cadastre-se</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={signIn} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Entrar</Text>
                    )}
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    logo: {
        width: '100%',
        height: '15%',
        marginBottom: '5%'
    },
    loginArea: {
        width: '80%',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#333',
        marginBottom: 5
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15
    },
    prompt: {
        fontSize: 14,
        color: '#555',
        marginTop: 10
    },
    signup: {
        fontSize: 14,
        color: '#0BBEE5',
        marginBottom: 20
    },
    loginButton: {
        backgroundColor: '#0BBEE5',
        borderRadius: 5,
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    
});

export default Login;
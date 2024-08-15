import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from 'react-native-animatable';

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/imagem_de_fundo.png')}
                style={{ width: '100%', height: '100%', opacity: 1.8 }}
            />
            <Animatable.Image
                animation="fadeInUp"
                source={require('../assets/logo baba preta.png')}
                style={{ width: '100%', position: 'absolute' }}
                resizeMode="contain"
            />
            <Animatable.View animation="fadeInUp" style={styles.quadrado}>
                <Text style={styles.login}> Login </Text>
                <Text style={styles.emailesenha}>E-mail</Text>
                <TextInput 
                    style={styles.emailinput}
                    placeholder="Digite seu Email"
                />
                <Text style={styles.emailesenha}>Senha</Text>
                <TextInput 
                    style={styles.senhainput}
                    placeholder="Digite sua Senha"
                    secureTextEntry
                />
                <Text style={styles.esqueceu}> Ainda não possui um login?</Text>
                <TouchableOpacity style={styles.cadastro}>
                    <Text 
                        style={styles.cadastrese} 
                        onPress={() => navigation.navigate('finalidade')}
                    > 
Cadastre-se 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaum}>
                    <Text style={styles.textobotaum}> Entrar </Text>
                </TouchableOpacity>
            </Animatable.View>           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    quadrado: {
        position: 'absolute',
        borderWidth: 1,
        width: '75%',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 25,
        paddingVertical: 80,
        backgroundColor: 'white',
        bottom: 150,
    },
    login: {
        position: 'absolute',
        top: 30,
        fontSize: 25,
        fontWeight: 'bold',
    },
    emailesenha: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 15,
        fontWeight: 'bold',
        right: 105,
    },
    emailinput: {
        backgroundColor: "white",
        borderRadius: 10,
        width: '90%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    senhainput: {
        backgroundColor: "white",
        borderRadius: 10,
        width: '90%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    esqueceu: {
        fontSize: 10,
        marginTop: 10,
        right: 60,
    },
    cadastrese: {
        fontSize: 10,
        marginTop: 10,
        bottom: 0,
        left: 17,
        position: 'absolute',
    },
    textobotaum: {
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    botaum: {
        position: 'absolute',
        width: '30%',
        paddingVertical: 5,
        backgroundColor: '#80f4FC',
        borderRadius: 10,
        bottom: 20,
    }
});

export default Login;

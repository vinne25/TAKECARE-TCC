import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';

const Cadastro = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [sexo, setSexo] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        if (email === '' || password === '' || confirmPassword === '' || name === '' || cpf === '' || sexo === '' || nascimento === '' || cep === '') {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não correspondem.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            await firestore().collection('Usuarios').doc(uid).set({
                name: name,
                email: email,
                cpf: cpf,
                sexo: sexo,
                nascimento: nascimento,
                cep: cep,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            setLoading(false);
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        } catch (error) {
            setLoading(false);
            handleFirebaseError(error);
        }
    };

    const handleFirebaseError = error => {
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Erro', 'Esse e-mail já está em uso!');
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Erro', 'O e-mail fornecido é inválido!');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
        }
    };

    return (
        <View>
            <Image
                source={require('../../../assets/Imagem/tamanho2.jpg')}
                style={styles.imgfundo}
            />
            <View style={styles.container}>
                <Image
                    source={require('../../../assets/Imagem/logotk.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <SafeAreaView style={styles.cadastroArea}>
                        <Text style={styles.title}>Cadastro</Text>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            onChangeText={setName}
                            value={name}
                        />

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

                        <Text style={styles.label}>Confirmar Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirme sua senha"
                            secureTextEntry
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                        />

                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu CPF"
                            keyboardType="numeric"
                            onChangeText={setCpf}
                            value={cpf}
                        />

                        <Text style={styles.label}>Sexo</Text>
                        <Picker
                            selectedValue={sexo}
                            style={styles.input}
                            onValueChange={(itemValue) => setSexo(itemValue)}
                        >
                            <Picker.Item label="Selecione seu sexo" value="" />
                            <Picker.Item label="Masculino" value="Masculino" />
                            <Picker.Item label="Feminino" value="Feminino" />
                        </Picker>

                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            keyboardType="numeric"
                            onChangeText={setNascimento}
                            value={nascimento}
                        />

                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu CEP"
                            keyboardType="numeric"
                            onChangeText={setCep}
                            value={cep}
                        />

                        <TouchableOpacity style={styles.signupButton} onPress={signUp} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.signupButtonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.backToLogin}>Voltar ao login</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'center',
        width: '90%', // Ajustado para um pouco mais estreito
        height: '94%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Levemente transparente para o fundo
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },

    imgfundo: {
        width: '100%',
        height: '100%',
    },

    logo: {
        width: '100%',
        height: 100, // Ajustado para uma altura fixa
        marginBottom: 20, // Mais espaçamento embaixo
    },
    scrollContainer: {
        paddingHorizontal: 0, // Removido padding horizontal do ScrollView
    },
    cadastroArea: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 26, // Aumentado para destaque
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center', // Centralizado
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8, // Espaçamento consistente
    },
    input: {
        height: 45, // Aumentado para facilitar a digitação
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    signupButton: {
        backgroundColor: '#0BBEE5',
        borderRadius: 5,
        height: 50, // Aumentado para melhorar a acessibilidade
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Mais espaço em cima
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 18, // Aumentado para melhor leitura
        fontWeight: 'bold',
    },
    backToLogin: {
        color: '#0BBEE5',
        marginTop: 15,
        textAlign: 'center',
        fontSize: 16, // Ajustado para harmonizar com o resto
    },
});

export default Cadastro;

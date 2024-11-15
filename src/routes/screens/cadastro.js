import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Modal,
    FlatList,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
    const [isBaba, setIsBaba] = useState(false); // Variável para determinar se o usuário é babá
    const [selectedSexuality, setSelectedSexuality] = useState(null);
    const [visible, setVisible] = useState(false);

    const data = [
        { id: '1', label: 'Masculino'},
        { id: '2', label: 'Feminino'},
        { id: '3', label: 'Outro' }
    ];

    const handleButtonPress = (label) => {
        setSelectedSexuality(label);
        setSexo(label);
    };

    const toggleList = () => {
        setVisible(!visible);
    };

    const handleSelect = () => {
        setVisible(false)
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.options} onPress={() => { handleButtonPress(item.label); handleSelect() }}>
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );

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

            // Determinar a coleção com base no tipo de usuário
            const collectionName = isBaba ? 'Babas' : 'Usuarios';

            // Salvar dados do usuário na coleção correta
            await firestore().collection(collectionName).doc(uid).set({
                name: name,
                email: email,
                cpf: cpf,
                sexo: sexo,
                nascimento: nascimento,
                cep: cep,
                isBaba: isBaba, // Define se o usuário é babá ou não
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            setLoading(false);
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
            navigation.navigate('MAPA');  // ou a tela que você deseja navegar após o cadastro
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
                        <Text style={styles.label}> Gênero </Text>
                        <TouchableOpacity style={styles.gnrbtn} onPress={toggleList}>
                            <Text style={styles.gnrtxt}> Selecione seu Gênero: </Text>
                            {selectedSexuality && (
                                <Text style={styles.gnrtxt}>
                                    {selectedSexuality}
                                </Text>
                            )}
                        </TouchableOpacity>
                        {(visible &&
                            <Modal visible={true} animationType='fade' transparent={true} onRequestClose={() => { }}>
                                <TouchableOpacity style={styles.modalcontainer} activeOpacity={1}>
                                    <TouchableOpacity style={styles.modalcontente} activeOpacity={1} >
                                        <FlatList
                                            style={styles.FlatList}
                                            data={data}
                                            renderItem={renderItem}
                                            keyExtractor={item => item.id} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </Modal>
                        )}

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

                        {/* Checkbox para selecionar se é babá */}
                        <View style={styles.checkboxContainer}>
                            <Text style={styles.label}>Sou babá</Text>
                            <TouchableOpacity 
                                style={styles.checkbox} 
                                onPress={() => setIsBaba(prevState => !prevState)}
                            >
                                <Text style={styles.checkboxText}>
                                    {isBaba ? '✔' : '❌'}
                                </Text>
                            </TouchableOpacity>
                        </View>

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
        width: '90%',
        height: '94%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    FlatList: {
        width: '100%',
        textAlign: 'left'
    },
    imgfundo: {
        width: '100%',
        height: '100%',
    },
    logo: {
        width: '100%',
        height: 100,
        marginBottom: 20,
    },
    scrollContainer: {
        paddingHorizontal: 0,
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
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
    checkboxText: {
        fontSize: 18,
        color: '#333',
    },
    signupButton: {
        backgroundColor: '#0BBEE5',
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backToLogin: {
        color: '#0BBEE5',
        textAlign: 'center',
        fontSize: 14,
    },
    gnrtxt: {
        fontSize: 14,
        marginLeft: 10
    },
    gnrbtn: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: '#ddd',
        marginBottom: 15
    },
    modalcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalcontente: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
    },
    options: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    }
});

export default Cadastro;

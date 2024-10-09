import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Modal,
    FlatList
} from 'react-native';
import { ArrowDown } from "react-native-feather";
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

const Cadastro = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');

    const signUp = async () => {
        try {
            // Criar usuário com Firebase Authentication
            const userCredential = await auth().createUserWithEmailAndPassword(email, password,);
            const uid = userCredential.user.uid; // Obter o UID do usuário

            // Salvar dados adicionais no Firestore
            await firestore().collection('Usuarios').doc(uid).set({
                name: name, // Nome do usuário
                email: email, // E-mail do usuário
                createdAt: firestore.FieldValue.serverTimestamp(), // Data de criação
            });

            console.log(
                'User account created & signed in, and user data added to Firestore!',
            );
            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        } catch (error) {
            handleFirebaseError(error);
        }
    };

    // Função para tratamento de erros
    const handleFirebaseError = error => {
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Erro', 'Esse e-mail já está em uso!');
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Erro', 'O e-mail fornecido é inválido!');
        } else {
            Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
            console.error(error);
        }
    };

    const [selectedSexuality, setSelectedSexuality] = useState(null);
    const [visible, setVisible] = useState(false);

    const data = [
        { id: '1', label: 'Masculino' },
        { id: '2', label: 'Feminino' },
        { id: '3', label: 'Outro' }
    ];

    const handleButtonPress = (label) => {
        setSelectedSexuality(label);
    };

    const toggleList = () => {
        setVisible(!visible);
    };

    const handleSelect = () => {
        setVisible(false); // Esconde a lista após a seleção
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.options} onPress={() => { handleButtonPress(item.label); handleSelect() }}>
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.conteiner}>
            <Image
                source={require('../../../assets/Imagem/logotk.png')}
                style={{ width: '100%', height: '13%', bottom: '17%' }}
                resizeMode="contain"
            />
            <SafeAreaView style={styles.areacd}>
                <Text>Cadastro</Text>
                <TextInput
                    style={styles.textinput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={setEmail}></TextInput>
                <TextInput
                    style={styles.textinput}
                    autoCapitalize="none"
                    placeholder="Senha"
                    onChangeText={setPassword}
                    secureTextEntry></TextInput>
                <TextInput
                    style={styles.textinput}
                    autoCapitalize="none"
                    placeholder="Senha"
                    onChangeText={setName}
                    secureTextEntry></TextInput>
                <TouchableOpacity style={styles.btnsexo} onPress={toggleList}>
                    {selectedSexuality && (
                        <Text>
                           . {selectedSexuality}
                        </Text>
                    )}
                    <ArrowDown color='black' />
                </TouchableOpacity>
                {(visible &&
                    <Modal visible={true} animationType='fade' transparent={true} onRequestClose={() => { }}>
                        <TouchableOpacity style={styles.modalcontainer} activeOpacity={1}>
                            <TouchableOpacity style={styles.modalcontente} activeOpacity={1} >
                                <FlatList
                                    data={data}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>
                )}
                <TouchableOpacity onPress={signUp}>
                    <Text>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text>Voltar ao login</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    areacd: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: '45%',
        width: '70%',
    },

    textinput: {
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 2,
        width: 200,
    },
    text: {
        position: 'absolute',
    },

    btnsexo: {
        flexDirection: 'row'
    },

    modalcontainer: {
        backgroundColor: 'rgba(0,0,0, 0.5)',
        flex: 1,
        justifyContent: 'center',
    },

    modalcontente: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 8,
        padding: 20,
    },

    options: {
        paddingVertical: 14,
        backgroundColor: 'rgba(208, 208, 208, 0.40)',
        borderRadius: 4,
        paddingHorizontal: 130,
        fontWeight: 'bold',
        alignSelf: 'center',
    }

});

export default Cadastro;

import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';

const Cadastro = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function signUp() {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            console.log('User account created & signed in!');
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
            }
    
            if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
            }
    
            console.error(error);
          });
      }
    return (
        <View style={styles.conteiner}>
            <Text>Cadastro</Text>
            <TextInput
                style={styles.textinput}
                autoCapitalize='none'
                placeholder='Email'
                onChangeText={setEmail}></TextInput>
            <TextInput
                style={styles.textinput}
                autoCapitalize='none'
                placeholder='Senha'                        
                onChangeText={setPassword}
                secureTextEntry></TextInput>
                <TouchableOpacity onPress={signUp}>
                    <Text>Cadastrar</Text>
                </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Voltar ao login</Text>
            </TouchableOpacity>
        </View>
    );
}

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
    },
    text: {
        position: 'absolute',
    },
});

export default Cadastro;

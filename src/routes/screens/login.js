import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) =>{
    
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        function signUp(){
            auth().createUserWithEmailAndPassword(email,password);
        }
    
        return(
        <View style={styles.conteiner}>
            <Text>Login</Text>
            <TextInput style={styles.textinput} placeholder="Email:" value="email" onChangeText={setEmail}></TextInput>
            <TextInput style={styles.textinput} placeholder="Senha:" value="password" onChangeText={setPassword}></TextInput>

            <TouchableOpacity onPress={() => navigation.navigate('TabRoutes')}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    conteiner:{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinput:{
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 2,
        width: 200,
    },
    text:{
        position: 'absolute'
    }
})

export default Login;
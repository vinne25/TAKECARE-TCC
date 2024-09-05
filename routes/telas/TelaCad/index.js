import React from "react";
import { 
    Text,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native'

//import AsyncStorage from "@react-native-async-storage/async-storage";

    const TelaCad = ({navigation}) => {

    return(
        <ScrollView style={styles.scrow}>
            <Image style={styles.img}
            source={require('../../Imagens/logotk.png')}
            resizeMode="contain"
            />
            <Text style={styles.textocadastro}> Dados Pessoais </Text>
            <Text style={styles.textoemail}> Escreva seu Nome Completo: </Text>
            <TextInput style={styles.inputemail} 
            placeholder="Nome Completo"
            />
            <Text style={styles.textoidade}> Digite sua Idade: </Text> 
            <TextInput style={styles.inputidade}
            placeholder="Idade"
            />
            <Text style={styles.textogenero}> Qual seu Gênero: </Text> 
            <TextInput style={styles.inputgenero}
            placeholder="Gênero"
            />
            <Text style={styles.textoemail}> Digite seu RG: </Text> 
            <TextInput style={styles.inputemail}
            placeholder="XX.XXX.XXX-X"
            />
            <Text style={styles.textoemail}> Digite seu CPF: </Text> 
            <TextInput style={styles.inputemail}
            placeholder="XXX.XXX.XXX-XX"
            />
            <Text style={styles.textoemail}> Digite um E-mail: </Text> 
            <TextInput style={styles.inputemail}
            placeholder="E-mail"
            />
            <Text style={styles.textoemail}> Confirme seu E-mail: </Text> 
            <TextInput style={styles.inputemail}
            placeholder="Confirmar"
            />
            <Text style={styles.textoemail}> Digite uma Senha: </Text> 
            <TextInput style={styles.inputemail}
            placeholder="Senha"
            secureTextEntry
            />
            <Text style={styles.textosenha}> Confirme sua Senha: </Text> 
            <TextInput style={styles.inputsenha}
            placeholder="Confirmar"
            secureTextEntry
            />
            <TouchableOpacity style={styles.botaoavanço} onPress={ () => navigation.navigate('Cadastrotrabalho')}>
            <Text style={styles.avanço}> Avançar </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaovoltar} onPress={ () => navigation.navigate('finalidade')}>
            <Text style={styles.voltar}> Voltar </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    img:{
        width: '100%',
        height: '20%'
    },

    scrow:{
        width: '100%',
        backgroundColor: '#6633FF',
    },
    
    textocadastro:{
        position:'relative',
        fontWeight:'bold',
        fontSize: 23,
        alignSelf: 'center',
        marginTop: 20,
        color: 'black',
    },

    textoidade:{
        position:'relative',
        fontSize:15,
        marginTop:20,
        paddingStart:18,
        fontWeight:'bold',
        marginBottom: 10,
        color: 'black',
    },

    inputidade:{
        borderRadius: 10,
        width: '36%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 20,
    },

    textogenero:{
        position: 'absolute',
        fontSize:15,
        paddingStart:18,
        fontWeight:'bold',
        marginBottom: 10,
        bottom: 500,
        right: 25,
        color: 'black'
    },

    inputgenero:{
        position: 'absolute',
        borderRadius: 10,
        width: '38%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
        bottom: 460,
        right: 20,
    },

    inputemail:{
        borderRadius: 10,
        width: '90%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'center',
    },

    textoemail:{
        position:'relative',
        fontSize:15,
        marginTop:20,
        paddingStart:18,
        fontWeight:'bold',
        marginBottom: 10,
        color: 'black'
    },

    textosenha:{
        position:'relative',
        fontSize:15,
        marginTop:20,
        paddingStart:18,
        fontWeight:'bold',
        marginBottom: 10, 
        color:  'black',
    },

    inputsenha:{
        backgroundColor: "white",
        borderRadius: 10,
        width: '90%', 
        paddingVertical: 5,
        paddingStart: 8,
        borderWidth: 1,
        borderColor: 'black',
        alignSelf: 'center',
        marginBottom: 20,
    },

    avanço:{
        alignSelf:'center',
        fontWeight: 'bold',
        color: 'black',
    },

    botaoavanço:{
        backgroundColor: 'red',
        width: '30%',
        alignSelf:'flex-end',
        paddingVertical: 5,
        marginBottom: 20,
        marginRight: 20,
        borderRadius: 10,
    },

    voltar:{
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'black',
    },

    botaovoltar:{
        position: 'absolute',
        backgroundColor: 'pink',
        width: '30%',
        alignSelf:'flex-start',
        paddingVertical: 5,
        marginBottom: 20,
        marginLeft: 20,
        borderRadius: 10,
        bottom:-100,
    }
})

export default TelaCad;
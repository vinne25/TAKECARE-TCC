import React from "react";
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity, 
} from 'react-native'

const Finalidade = ({navigation}) => {
    return (
        <View style={styles.container}>
        <Image
        source={require('../../TAKECARE-TCC/screens/Imagens/imagem de fundo.png')}
        style={{ width: '100%', height: '100%', opacity: 0.8}}
        />
        <Text style={styles.finalidade}> PARA QUAL FINALIDADE {"\n"} PRETENDE UTILIZAR {"\n"} ESTE APLICATIVO? </Text>
        <TouchableOpacity style={styles.botaumtrabalhador} onPress={ () => navigation.navigate('Telababa')}>
            <Image
            source={require('../../TAKECARE-TCC/screens/Imagens/mother.png')}
            style={{ width: '100%', height: '70%', top: 10}}
            resizeMode="contain"
            />
            <Text style={styles.textotrabalhador}> Trabalho </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaumcliente} onPress={ () => navigation.navigate('Telacliente')}>
            <Image 
            source={require('../../TAKECARE-TCC/screens/Imagens/mother.png')}
            style={{ width: '100%',height: '70%' }}
            resizeMode="contain"
            />
            <Text style={styles.textocliente}> Contratar </Text>
        </TouchableOpacity>
    </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
    },

    finalidade:{
        position: 'absolute',
        textAlign: 'center',
        top:60,
        fontSize: 20,
        fontWeight: 'bold'
},

    textocliente:{
        alignSelf: 'center',
        top: 5,
    },

    textotrabalhador:{
        alignSelf:'center',
        justifyContent: 'center',
        top: 20
    },

    botaumcliente:{
        borderWidth:1,
        backgroundColor: 'white',
        width: 150,
        justifyContent: 'center',
        height: 150,
        position: 'absolute',
        top: 550,
        borderRadius: 20,
    },

    botaumtrabalhador:{
        borderWidth:1,
        backgroundColor: 'white',
        width: 150,
        height: 150,
        position: 'absolute',
        borderRadius: 20,
        top: 220,
    }
})

export default Finalidade
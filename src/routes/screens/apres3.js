import React from 'react';
import { View,Image, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Seguranca = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Animatable.Image
        animation='fadeIn'
          style={styles.img}
          source={require("../../../assets/Imagem/logotk.png")}
          resizeMode="contain"
        />
        <Text style={styles.texto}>Segurança e transparência</Text>
        <Image
        source={require('../../../assets/Imagem/icones/icone1.png')}
        style={styles.icone1}
      />
        <Image
        source={require('../../../assets/Imagem/layout3.png')}
        style={styles.image}
      />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      justifyContent: 'flex-start', // Alinha itens ao topo
      alignItems: 'center',         // Centraliza itens horizontalmente
      paddingTop: 20, 
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaçamento entre os objetos
    alignItems: 'center', // Alinha os objetos verticalmente
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espaçamento entre os objetos
    alignItems: 'center', // Alinha os objetos verticalmente
    paddingLeft: 20,
    paddingRight: 12,
    marginBottom: 10,
  },
  texto:{
      color: '#000000',
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 40,
      marginBottom: 15,
  },
  texto2:{
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
  },
  img:{
    width: '100%', 
    height: '13%',
  },
  button: {
    position: 'absolute', //para posicioná-lo de forma independente do layout principal
    bottom: 45, // Distância da parte inferior da tela
    justifyContent: 'flex-end',
    backgroundColor: '#0BBEE5',
    padding: 10,
    borderRadius: 15,
    height: '6.2%',
    width: '65%',
    alignItems: 'center',
},
buttonText:{
  color: '#fff',
  fontSize: 21,
  bottom: '8%'
  },
  image: {
    position: 'absolute',
    top: '42.5%',
    width: '110%',
    height: '74%',
    resizeMode: 'contain',},
    icone1:{
      width: 40,
      height: 35,
      bottom: 518,
      flexDirection: 'row',
    justifyContent: 'space-between', // Espaçamento entre os objetos
  alignItems: 'center', // Alinha os objetos verticalmente
  paddingLeft: 20,
  paddingRight: 20,
  marginBottom: 10,

    }
  });

export default Seguranca;
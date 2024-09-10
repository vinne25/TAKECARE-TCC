import React, { useState, useEffect } from 'react';
import { View,Image,TouchableOpacity,StyleSheet, Text} from 'react-native';
import * as Animatable from 'react-native-animatable'

const Conexoes = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Animatable.Image
        animation='fadeIn'
          style={styles.img}
          source={require('../../../assets/Imagem/logotk.png')}
          resizeMode="contain"
        />
        <Text style={styles.texto}>Conexões</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Seguranca')}>
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
    bottom: 30, // Distância da parte inferior da tela
    justifyContent: 'flex-end',
    backgroundColor: '#0BBEE5',
    padding: 10,
    borderRadius: 15,
    height: 50,
    width: 150,
    alignItems: 'center',
},
buttonText:{
    color: '#fff',
    fontSize: 20,
},
});

export default Conexoes;
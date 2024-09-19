import React, { useState, useEffect } from 'react';
import { View,Image,TouchableOpacity,StyleSheet, Text} from 'react-native';
import * as Animatable from 'react-native-animatable'
import { AlignLeft } from 'react-native-feather';

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
        <View style={styles.row}>
        <View
        style={{
          width: '4%',
          height: '30%',
          borderRadius: 50,
          backgroundColor: '#0BBEE5',
        }}/>
        <Text style={styles.texto2}>Responda mensagens ou envie mensagens para babás</Text>
        </View>
        <View style={styles.row}>
        <View
        style={{
          width: '4%',
          height: '30%',
          borderRadius: 90,
          backgroundColor: '#0BBEE5',
        }}/>
        <Text style={styles.texto2}>Tenha um encontro introdutorio usando nosso chat</Text>
        </View>
        <View style={styles.row}>
        <View
        style={{
          width: '4%',
          height: '30%',
          borderRadius: 100,
          backgroundColor: '#0BBEE5',
          alignItems: AlignLeft,
        }}/>
        <Text style={styles.texto2}>Planeje o trabalho da babá e alinhe pontos importantes</Text>
        </View>
        <Image
        source={require('../../../assets/Imagem/layout2.png')}
        style={styles.image}
      />
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
  height: '15%',
},
button: {
  position: 'absolute', //para posicioná-lo de forma independente do layout principal
  bottom: 45, // Distância da parte inferior da tela
  justifyContent: 'center',
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
  width: '105%',
  height: '76%',
  resizeMode: 'contain',}
});

export default Conexoes;
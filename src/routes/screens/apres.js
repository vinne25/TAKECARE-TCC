import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';

const Pesquisar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="fadeIn"
        style={styles.img}
        source={require('../../../assets/Imagem/logotk.png')}
        resizeMode="contain"
      />
      <Text style={styles.title}>Pesquisar</Text>
      
      {/* Descrição */}
      <View style={styles.descriptionContainer}>
        <View style={styles.iconBullet} />
        <Text style={styles.descriptionText}>
          Use a barra de pesquisa para encontrar trabalho ou babás na sua área
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
        <View style={styles.iconBullet} />
        <Text style={styles.descriptionText}>
          Use os filtros para pesquisar baseados nas suas necessidades
        </Text>
      </View>
      
      {/* Imagem de layout */}
      <Image
        source={require('../../../assets/Imagem/layout.png')}
        style={styles.backgroundImage}
      />

      {/* Botão Continuar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Conexoes')}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  img: {
    width: '100%',
    height: '15%',
    marginBottom: 20,
  },
  title: {
    color: '#333',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10, // Arredondamento sutil
  },
  iconBullet: {
    width: 10,
    height: 10,
    borderRadius:10,
    backgroundColor: '#0BBEE5',
    marginRight: 10,
  },
  descriptionText: {
    fontSize: 16.5,
    color: '#555',
    flexShrink: 1,
  },
  backgroundImage: {
    width: '106%',
    height: '76%',
    resizeMode: 'contain',
    position: 'absolute',
    top: '45%',

  },
  button: {
    position: 'absolute',
    bottom: 45,
    justifyContent: 'center',
    backgroundColor: '#0BBEE5',
    padding: 10,
    borderRadius: 20,
    height: '6.2%',
    width: '65%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Pesquisar;

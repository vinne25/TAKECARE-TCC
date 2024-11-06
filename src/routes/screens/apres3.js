import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Seguranca = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="fadeIn"
        style={styles.img}
        source={require("../../../assets/Imagem/logotk.png")}
        resizeMode="contain"
      />
      <Text style={styles.title}>Segurança e Transparência</Text>
      
      {/* Descrição com Ícones */}
      <View style={styles.descriptionContainer}>
        <Image
          source={require('../../../assets/Imagem/icones/icone1.png')}
          style={styles.icon}
        />
        <Text style={styles.descriptionText}>
          Conte com verificação de identidade para garantir a segurança das babás e dos pais.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
      <Image
          source={require('../../../assets/Imagem/icones/icone3.png')}
          style={styles.icon}
        />
        <Text style={styles.descriptionText}>
          Avaliações e referências.
        </Text>
      </View>
      <View style={styles.descriptionContainer}>
      <Image
          source={require('../../../assets/Imagem/icones/icone4.png')}
          style={styles.icon}
        />
        <Text style={styles.descriptionText}>
          
          Mantenha histórico de mensagens e interações no app.
        </Text>
      </View>

      {/* Imagem de layout */}
      <Image
        source={require('../../../assets/Imagem/layout3.png')}
        style={styles.backgroundImage}
      />

      {/* Botão Continuar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
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
    width: '80%',
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
    borderRadius: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  iconBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0BBEE5',
    marginRight: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1,
  },
  backgroundImage: {
    width: '110%',
    height: '74%',
    resizeMode: 'contain',
    position: 'absolute',
    top: '42.5%',
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

export default Seguranca;

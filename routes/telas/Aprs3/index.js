import React from 'react';
import { View,Image, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import styles from '../$tyles';

const Aprs3 = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Image
        style={styles.img}
        source={require('../../Imagens/logotk.png')}
        resizeMode="contain"
        />
        <Text style={styles.texto}>Segurança</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Entrar')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
};

export default Aprs3;
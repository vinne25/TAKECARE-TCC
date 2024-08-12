import React from 'react';
import { View,Image, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import styles from './style';

const Seguranca = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../assets/logotk.png')}
          resizeMode="contain"
        />
        <Text style={styles.texto}>Segurança</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('login')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
};

export default Seguranca;


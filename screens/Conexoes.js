import React, { useState, useEffect } from 'react';
import { View,Image,TouchableOpacity,StyleSheet, Text} from 'react-native';
import styles from './style';

const Conexoes = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../assets/logotk.png')}
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

export default Conexoes;
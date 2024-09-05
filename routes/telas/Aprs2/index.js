import React, { useState, useEffect } from 'react';
import { View,Image,TouchableOpacity,StyleSheet, Text} from 'react-native';
import styles from '../$tyles';

const Aprs2 = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../../Imagens/logotk.png')}
          resizeMode="contain"
        />
        <Text style={styles.texto}>Conexões</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Aprs3')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
};

export default Aprs2;
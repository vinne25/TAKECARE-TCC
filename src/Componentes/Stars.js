import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import StarFull from '../../assets/svgs/star.svg';
import StarHalf from '../../assets/svgs/star_half.svg';
import StarEmpty from '../../assets/svgs/star_empty.svg';

const styles = StyleSheet.create({
  starArea: {
    flexDirection: 'row',
  },
  starView: {
    // Nenhuma estilização extra necessária aqui, mas pode ser customizado
  },
  starText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#737373',
  },
});

const StarComponent = ({ stars, showNumber }) => {
  let s = [0, 0, 0, 0, 0];  // Inicia um array de 5 estrelas
  let floor = Math.floor(stars);  // Parte inteira das estrelas
  let left = stars - floor;  // Parte fracionária (meia estrela)

  // Preenche o array com as estrelas inteiras
  for (let i = 0; i < floor; i++) {
    s[i] = 2;  // 2 = Estrela cheia
  }

  // Se houver meia estrela
  if (left > 0) {
    s[floor] = 1;  // 1 = Meia estrela
  }

  return (
    <View style={styles.starArea}>
      {s.map((i, k) => (
        <View key={k} style={styles.starView}>
          {i === 0 && <StarEmpty width="18" height="18" fill="#FF9200" />}
          {i === 1 && <StarHalf width="18" height="18" fill="#FF9200" />}
          {i === 2 && <StarFull width="18" height="18" fill="#FF9200" />}
        </View>
      ))}
      {showNumber && <Text style={styles.starText}>{stars}</Text>}
    </View>
  );
};

export default StarComponent;

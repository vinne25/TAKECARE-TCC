import { View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import styles from './style';

const Pesquisar = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={require('../assets/logotk.png')}
          resizeMode="contain"
        />
        <Text style={styles.texto}>Pesquisar</Text>
        <View style={styles.row}>
        <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 100,
          backgroundColor: '#0BBEE5',
        }}/>
        <Text style={styles.texto2}>Use a barra de pesquisa para
        encontrar trabalho ou babás na sua area</Text>
        </View>
        <View style={styles.row2}>
        <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 100,
          backgroundColor: '#0BBEE5',
        }}/>
        <Text style={styles.texto2}>Use os filtros para pesquisar baseados nas
        suas necessidades</Text>
        </View>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Conexões')}>
        <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
};

export default Pesquisar;

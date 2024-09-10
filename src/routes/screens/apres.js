import { View, 
  TouchableOpacity, 
  Image, 
  Text, 
  StyleSheet} from 'react-native';
  import * as Animatable from 'react-native-animatable'


const Pesquisar = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Animatable.Image
        animation='fadeIn'
          style={styles.img}
          source={require('../../../assets/Imagem/logotk.png')}
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
        onPress={() => navigation.navigate('Conexoes')}>
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

export default Pesquisar;
import { StyleSheet } from "react-native";

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
        width: 100,
        height: 155
    },
    button: {   
      position: 'absolute',   // Posiciona o botão no rodapé
      bottom: 30,             // Espaço do botão a partir da parte inferior da tela
      left: '50%',           // Centraliza horizontalmente
      marginLeft: -100,       // Ajusta a posição para centralizar
      width: 220,
      height: 50,
      backgroundColor: '#F2F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      zIndex: 1,            // Garante que o botão fique acima da imagem
    },
    buttonText:{
        color: '#000000',
        fontSize: 22.5,
    },
    imageBackground: {
      position: 'absolute', // Posiciona a imagem
      bottom: 0,            // Fixa a imagem no rodapé
      left: 0,
      width: '100%',
      height: 300,          // Altura da imagem de fundo no rodapé
      zIndex: -1,    
    },
});

export default styles;
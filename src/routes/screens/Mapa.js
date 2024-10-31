import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomMarkerImage from '../../../assets/Imagem/logotk.png'; // Altere o caminho para a sua imagem

const App = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("Usuarios")
      .onSnapshot(querySnapshot => {
        const locations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          preco: doc.data().preco,
          avaliacao: doc.data().avaliacao,
          Localidade: doc.data().Localidade,
          imagem: doc.data().imagem,
        }));
        setDados(locations);
        setLoading(false);
      }, error => {
        console.error("Erro ao buscar dados: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.mapa}
        initialRegion={{
          latitude: -23.550935,
          longitude: -46.634257,
          latitudeDelta: 0.0091,
          longitudeDelta: 0.0135,
        }}
      >
        {dados.map(item => (
          item.Localidade && item.Localidade.latitude && item.Localidade.longitude ? (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.Localidade.latitude,
                longitude: item.Localidade.longitude,
              }}
              title={item.nome}
              description={`Preço: ${item.preco}`}
              image={CustomMarkerImage}
            />
          ) : null
        ))}
      </MapView>

      {/* FlatList Horizontal */}
      <FlatList
        data={dados}
        horizontal
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card 
            nome={item.nome} 
            preco={item.preco} 
            avaliacao={item.avaliacao} 
            imagem={item.imagem} 
          />
        )}
        contentContainerStyle={styles.flatListContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const Card = ({ nome, preco, avaliacao, imagem }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imagem }} style={styles.image} />
      <View style={styles.containerInformacoes}>
        <Text style={styles.title}>{nome}</Text>
        <Text style={styles.preco}>Preço: R$ {preco}</Text>
        <Text style={styles.avaliacao}>Avaliação: {avaliacao}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0BBEE5',
  },
  mapa: {
    width: '100%',
    height: '77%', // Ajuste a altura do mapa conforme necessário
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    padding:10
  },
  card: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    width: 380, // Largura do card
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  containerInformacoes: {
    alignItems: 'center',
  },
  title: {
    color: "#3772FF",
    fontWeight: "600",
    lineHeight: 20,
    fontSize: 25,
    marginBottom: 8,
  },
  preco: {
    color: "#737380",
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 4,
  },
  avaliacao: {
    color: "#737380",
    lineHeight: 16,
    fontSize: 12,
  },
});

export default App;

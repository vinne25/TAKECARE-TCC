import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomMarkerImage from '../../../assets/Imagem/logotk.png'; // Imagem do marcador no mapa

const { width } = Dimensions.get('window'); // Pega a largura da tela

const App = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("Babas")
      .onSnapshot(querySnapshot => {
        const locations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          valor: doc.data().valor,
          avaliacao: doc.data().avaliacao,
          experiencia: doc.data().experiencia,
          descricao: doc.data().descricao,
          localidade: doc.data().localidade,
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

  const handleMarkerPress = (item) => {
    setSelectedItem(item);
  };

  const handleFavoritePress = (babáId) => {
    const userId = auth().currentUser?.uid; // Obtém o ID do usuário autenticado

    if (!userId) {
      console.log('Usuário não autenticado!');
      return;
    }

    // Verificar se a babá já está nos favoritos do usuário
    firestore()
      .collection('Favoritos')
      .where('userId', '==', userId)
      .where('babáId', '==', babáId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // Adicionar a babá aos favoritos
          firestore()
            .collection('Favoritos')
            .add({
              userId: userId,
              babáId: babáId,
              nome: selectedItem.nome,
              valor: selectedItem.valor,
              avaliacao: selectedItem.avaliacao,
              experiencia: selectedItem.experiencia,
              descricao: selectedItem.descricao,
              imagem: selectedItem.imagem,
              localidade: selectedItem.localidade,
              criadoEm: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log('Babá adicionada aos favoritos!');
            })
            .catch(error => {
              console.error('Erro ao adicionar aos favoritos:', error);
            });
        } else {
          // A babá já está nos favoritos, podemos removê-la
          querySnapshot.forEach(doc => {
            firestore()
              .collection('Favoritos')
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Babá removida dos favoritos!');
              })
              .catch(error => {
                console.error('Erro ao remover dos favoritos:', error);
              });
          });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar favoritos:', error);
      });
  };

  const formatExperiencia = (anos) => {
    return anos === 1 ? `${anos} Ano` : `${anos} Anos`;
  };

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
          item.localidade?.latitude && item.localidade?.longitude && (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.localidade.latitude,
                longitude: item.localidade.longitude,
              }}
              onPress={() => handleMarkerPress(item)}
              icon={CustomMarkerImage} // Substitua por sua própria imagem de marcador
            />
          )
        ))}
      </MapView>

      {/* Exibe o cartão apenas se um item estiver selecionado */}
      {selectedItem && (
        <View style={styles.cardContainer}>
          <Card
            nome={selectedItem.nome}
            valor={selectedItem.valor}
            avaliacao={selectedItem.avaliacao}
            experiencia={selectedItem.experiencia}
            descricao={selectedItem.descricao}
            imagem={selectedItem.imagem}
            onFavoritePress={handleFavoritePress}
            babáId={selectedItem.id} // Passando o ID da babá para a função
            formatExperiencia={formatExperiencia}
          />
        </View>
      )}
    </View>
  );
};

const Card = ({ nome, valor, avaliacao, experiencia, descricao, imagem, onFavoritePress, babáId, formatExperiencia }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imagem }} style={styles.image} />
      <View style={styles.containerInformacoes}>
        <Text style={styles.title}>{nome}</Text>
        <Text style={styles.descricao}>
          {descricao ? descricao.substring(0, 100) + '...' : "Sem descrição disponível."}
        </Text>
        <Text style={styles.experiencia}>
          <Text style={styles.boldText}>Experiência:</Text> {formatExperiencia(experiencia)}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.avaliacao}>
            <Text style={styles.boldText}>Avaliação:</Text> {avaliacao}⭐
          </Text>
          <Text style={styles.preco}>
            <Text style={styles.boldText}>R$:</Text> {valor}
          </Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavoritePress(babáId)}>
          <Text style={styles.favoriteText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF80',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF80',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 5, height: 1 },
    padding: 10,
    height: 170,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  containerInformacoes: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  experiencia: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  preco: {
    fontSize: 20,
    color: '#333',
  },
  avaliacao: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    height: 60,
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 5,
    padding: 10,
  },
  favoriteText: {
    fontSize: 30,
    color: '#F00',
  },
});

export default App;

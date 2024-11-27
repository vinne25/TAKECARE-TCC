import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Importando o hook de navegação

const FavoritosScreen = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Hook para navegação

  useEffect(() => {
    const userId = auth().currentUser?.uid;

    if (userId) {
      const unsubscribe = firestore()
        .collection('Favoritos')
        .where('userId', '==', userId)
        .onSnapshot(querySnapshot => {
          const favoritosList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavoritos(favoritosList);
          setLoading(false);
        }, error => {
          console.error('Erro ao buscar favoritos:', error);
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, []);

  const handleRemoveFavorite = (babáId) => {
    const userId = auth().currentUser?.uid;

    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    Alert.alert(
      'Remover dos favoritos',
      'Você tem certeza que deseja remover esta babá dos seus favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => {
            firestore()
              .collection('Favoritos')
              .where('userId', '==', userId)
              .where('babáId', '==', babáId)
              .get()
              .then(querySnapshot => {
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
              })
              .catch(error => {
                console.error('Erro ao buscar babá para remoção:', error);
              });
          },
        },
      ]
    );
  };

  const handleChatPress = (babáId) => {
    // Aqui vamos gerar um chatId único para o usuário e a babá
    const userId = auth().currentUser?.uid;
    const chatId = userId < babáId ? `${userId}-${babáId}` : `${babáId}-${userId}`;
    
    // Navega para a tela de chat e passa o chatId e babáId como parâmetros
    navigation.navigate('CHAT', { chatId, babáId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.valor}>R$ {item.valor}</Text>
        <Text style={styles.avaliacao}>Avaliação: {item.avaliacao}⭐</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(item.babáId)}
          >
            <Icon name="trash" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => handleChatPress(item.babáId)} // Passa o babáId para o chat
          >
            <Icon name="comments" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoritos.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF80',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  valor: {
    fontSize: 16,
    color: '#333',
  },
  avaliacao: {
    fontSize: 14,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  chatButton: {
    backgroundColor: '#0BBEE5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

export default FavoritosScreen;

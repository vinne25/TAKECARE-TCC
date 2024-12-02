import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg'; 
import { useNavigation } from '@react-navigation/native'; 

const FavoritosScreen = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    const userId = auth().currentUser?.uid;

    if (userId) {
      const unsubscribe = firestore()
        .collection('Favoritos')
        .where('userId', '==', userId)
        .onSnapshot(querySnapshot => {
          const favoritosList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            if (data && data.babáId && data.name && data.profileImage) {
              return {
                id: doc.id,
                ...data,
              };
            }
            return null; // Se algum campo esperado não existir, não incluir no resultado
          }).filter(item => item !== null); // Filtra os itens inválidos

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

 
const handleChatPress = async (babáId) => {
  const userId = auth().currentUser?.uid;
  if (!userId || !babáId) {
    console.error('Erro: userId ou babáId não definidos.');
    return;
  }

  // Gerar chatId com base nos ids
  const chatId = userId < babáId ? `${userId}-${babáId}` : `${babáId}-${userId}`;

  // Verificar ou criar o chat no Firestore
  const chatRef = firestore().collection('chats').doc(chatId);
  const chatDoc = await chatRef.get();

  if (!chatDoc.exists) {
    await chatRef.set({
      users: [userId, babáId],
      lastMessage: '',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  navigation.navigate('CHAT', { chatId, babáId });
};

const estrelaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0BBEE5" width="17px" height="17px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;


  const renderItem = ({ item }) => {
    // Verificação para garantir que os dados estão corretos
    if (!item || !item.profileImage || !item.name || !item.valor || !item.babáId) {
      return null; // Caso faltem dados, não renderiza o item
    }

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.profileImage }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.valor}>R$ {item.valor}</Text>
          <View style={styles.avaliacaoContainer}>
          <Text style={styles.avaliacao}>(0)</Text>
          <SvgXml xml={estrelaSvg} />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFavorite(item.babáId)}
            >
             <Text style={styles.removeButtonText}>REMOVER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleChatPress(item.babáId)} 
            >
               <Text style={styles.chatButtonText}>CHAT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  valor: {
    fontSize: 17,
    color: '#555',
    fontWeight: '600',
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avaliacao: {
    fontSize: 13,
    color: '#555',
    marginRight:2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  removeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#0BBEE5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FavoritosScreen;

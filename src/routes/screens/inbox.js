import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const InboxScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const unsubscribe = firestore()
        .collection('chats')
        .where('users', 'array-contains', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          querySnapshot => {
            if (querySnapshot && !querySnapshot.empty) {
              const chatList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                lastMessage: doc.data().lastMessage || 'Sem mensagens ainda',
                users: doc.data().users,
                ...doc.data(),
              }));
              setChats(chatList);
            } else {
              setChats([]); // Se não houver chats
            }
            setLoading(false);
          },
          error => {
            console.error('Erro ao carregar chats', error);
            setLoading(false);
          }
        );

      return () => unsubscribe();
    }
  }, [userId]);

  // Buscar o perfil dos usuários de cada chat
  useEffect(() => {
    if (chats.length > 0) {
      const userIds = chats.flatMap(chat => chat.users).filter(id => id !== userId);
      const uniqueUserIds = [...new Set(userIds)];

      uniqueUserIds.forEach(otherUserId => {
        // Aqui você pode buscar diretamente nas coleções de 'babas' ou 'usuarios' dependendo do tipo de usuário
        firestore()
          .collection('Babas')  // Ou 'Usuarios' dependendo da sua estrutura de dados
          .doc(otherUserId)
          .get()
          .then(doc => {
            if (doc.exists) {
              setUserProfiles(prev => ({
                ...prev,
                [otherUserId]: doc.data(),
              }));
            }
          })
          .catch(error => console.error('Erro ao carregar perfil do usuário', error));
      });
    }
  }, [chats, userId]);

  const handleChatSelect = (chatId, otherUserId) => {
    navigation.navigate('CHAT', { chatId, babáId: otherUserId });
  };

  const renderItem = useCallback(({ item }) => {
    const otherUserId = item.users.find(id => id !== userId);
    const otherUserProfile = userProfiles[otherUserId];

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatSelect(item.id, otherUserId)}
        activeOpacity={0.7}
      >
        <Image
          source={
            otherUserProfile?.profileImage
              ? { uri: otherUserProfile.profileImage }
              : require('../../../assets/Imagem/logotk.png') // Imagem de fallback
          }
          style={styles.avatar}
        />
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>{otherUserProfile?.name || `Usuário ${otherUserId}`}</Text>
          <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [userId, userProfiles]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (chats.length === 0) {
    return <Text>Sem chats disponíveis.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#F5F5F5' },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatName: { fontSize: 16, fontWeight: '600' },
  chatLastMessage: { fontSize: 14, color: '#777' },
});

export default InboxScreen;

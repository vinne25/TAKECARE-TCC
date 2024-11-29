import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Chat = ({ route }) => {
  const { chatId, babáId } = route.params;  // Recebe os parâmetros passados

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState(null); // Usuário logado
  const [userProfileImage, setUserProfileImage] = useState(''); // Imagem de perfil do usuário
  const [babáProfileImage, setBabáProfileImage] = useState(''); // Imagem de perfil da babá
  const flatListRef = useRef(); // Referência para o FlatList

  // Obter o usuário logado
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);

      // Buscar a imagem de perfil do usuário logado na coleção 'usuarios' ou 'babas'
      const userCollection = babáId ? 'babas' : 'usuarios';
      firestore()
        .collection(userCollection)
        .doc(currentUser.uid) // Obtendo o documento do usuário logado
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserProfileImage(userData.profileImage); // Pega a URL da imagem de perfil
          }
        });
    }
  }, [babáId]);

  // Buscar as mensagens do Firestore, agora ordenadas de forma crescente (mais antigas primeiro)
  useEffect(() => {
    if (chatId) {
      const unsubscribe = firestore()
        .collection('chats')
        .doc(chatId)  // Usando chatId
        .collection('messages')
        .orderBy('createdAt', 'asc')  // Ordenando por data, mais recentes primeiro
        .onSnapshot((querySnapshot) => {
          const messagesFirestore = querySnapshot.docs.map((doc) => doc.data());
          setMessages(messagesFirestore);
        });

      return () => unsubscribe();
    }
  }, [chatId]);

  // Enviar mensagem
  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      text: inputText,
      createdAt: new Date(),
      user: { id: user.uid, name: user.displayName || 'Você', profileImage: userProfileImage }, // Inclui a foto do usuário
    };

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(newMessage);

    setInputText('');  // Limpa o campo de texto após enviar a mensagem
  };

  // Função para formatar a hora da mensagem
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Renderizar cada item (mensagem)
  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.user.id === user.uid;  // Verifica se a mensagem é do usuário logado
    const messageTime = formatTime(item.createdAt.toDate()); // Formata o horário da mensagem

    return (
      <View 
        style={[
          styles.messageContainer,
          { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' },  // Alinha à direita para o usuário logado, esquerda para o outro
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage  // Estilos diferentes para cada usuário
        ]}
      >
        {/* Exibir a imagem do outro usuário em um círculo (só mostra para o outro usuário) */}
        {!isCurrentUser && (
          <Image 
            source={{ uri: item.user.profileImage || 'https://firebasestorage.googleapis.com/v0/b/takecare-dfb73.appspot.com/o/image%2FT0fJzhzj0BMHSoT6lWBncKgivPq1?alt=media&token=854871b3-3665-462b-baee-e5b29d4967ab' }}  // Foto do usuário ou imagem padrão
            style={styles.avatar}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.messageUser}>{item.user.name}:</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {/* Hora da mensagem */}
        <Text style={styles.messageTime}>{messageTime}</Text>
      </View>
    );
  };

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);  // Sempre que a lista de mensagens mudar

  if (!user || !chatId) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Lista de mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Campo de input e botão de envio */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: Math.max(40, inputText.split('\n').length * 20) }]}  // Ajusta altura do campo de input conforme o conteúdo
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
    flexShrink: 1,  // O balão vai se ajustar ao tamanho do texto
    paddingHorizontal: 10, // Adicionando algum padding para melhorar a estética
    minWidth: 50, // Largura mínima para não ficar muito pequeno
    maxWidth: '80%', // Limitar a largura do balão, mas sem ser 80% fixo
  },
  currentUserMessage: {
    backgroundColor: '#a7d7e6', // Cor de fundo para mensagens do usuário logado
    borderBottomRightRadius: 0,
  },
  otherUserMessage: {
    backgroundColor: '#E6E6E6', // Cor de fundo para mensagens do outro usuário
    borderBottomLeftRadius: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,  // Tornando a imagem circular
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#000',
  },
  messageText: {
    marginTop: 5,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',  // Hora sempre no final da mensagem
    marginTop: 5,
    marginLeft: 10,  // Separação entre o texto e o horário
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#a7d7e6',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 5,
    backgroundColor: '#0BBEE5',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Chat;

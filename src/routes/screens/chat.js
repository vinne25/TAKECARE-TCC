import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Chat = ({ route }) => {
  const { chatId: initialChatId, babáId } = route.params;  // Recebe os parâmetros passados
  const [chatId, setChatId] = useState(initialChatId || '');  // Declara corretamente o estado chatId
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState(null); // Usuário logado
  const [userProfileImage, setUserProfileImage] = useState(''); // Imagem de perfil do usuário
  const [babáProfileImage, setBabáProfileImage] = useState(''); // Imagem de perfil da babá
  const flatListRef = useRef(); // Referência para o FlatList

  const defaultProfileImage = 'https://www.example.com/default-image.jpg';  // Imagem de fallback

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
            setUserProfileImage(userData.profileImage || defaultProfileImage); // Pega a URL da imagem de perfil
          }
        });
    }
  }, [babáId]);

  // Buscar a imagem de perfil da babá (ou outro participante)
  useEffect(() => {
    if (babáId && babáId !== user?.uid) {
      firestore()
        .collection('babas') // Assumindo que você tem uma coleção para babás
        .doc(babáId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const babáData = doc.data();
            setBabáProfileImage(babáData.profileImage || defaultProfileImage); // Pega a URL da imagem de perfil da babá
          }
        });
    }
  }, [babáId, user]);

  // Função para criar um chat se ele não existir
  const createChat = async (userId1, userId2) => {
    const chatRef = firestore().collection('chats').doc(); // Cria um novo documento com ID gerado automaticamente

    // Criar o documento do chat com os campos 'users' e 'lastMessage'
    await chatRef.set({
      users: [userId1, userId2], // IDs dos usuários envolvidos
      lastMessage: 'Início do chat', // Última mensagem (mensagem padrão no início)
      createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp de criação
    });

    // Criar a subcoleção 'messages' (inicia com a primeira mensagem)
    await chatRef.collection('messages').add({
      text: 'Início do chat', // Mensagem inicial
      senderId: userId1, // ID do remetente
      createdAt: firestore.FieldValue.serverTimestamp(), // Timestamp da mensagem
    });

    console.log('Chat criado com sucesso!');
    return chatRef.id;  // Retorna o chatId
  };

  // Função para buscar ou criar um chat
  const getChatId = async () => {
    if (chatId) {
      return chatId;  // Se o chatId já for passado, retorna ele
    }

    // Se não existe um chatId, cria um novo chat
    const chatRef = await firestore()
      .collection('chats')
      .where('users', 'array-contains', user.uid)  // Verifica se o usuário já tem um chat com a babá
      .where('users', 'array-contains', babáId)
      .get();

    if (!chatRef.empty) {
      // Se encontrar o chat, retorna o ID do chat existente
      return chatRef.docs[0].id;
    } else {
      // Se não encontrar, cria um novo chat
      return await createChat(user.uid, babáId);
    }
  };

  // Buscar as mensagens do Firestore, agora ordenadas de forma crescente (mais antigas primeiro)
  useEffect(() => {
    const fetchChat = async () => {
      const chatIdFromDb = await getChatId(); // Busca ou cria o chat
      setChatId(chatIdFromDb); // Atualiza o estado com o chatId

      const unsubscribe = firestore()
        .collection('chats')
        .doc(chatIdFromDb)  // Usando chatId
        .collection('messages')
        .orderBy('createdAt', 'asc')  // Ordenando por data, mais recentes primeiro
        .onSnapshot((querySnapshot) => {
          const messagesFirestore = querySnapshot.docs.map((doc) => {
            const message = doc.data();
            // Se 'createdAt' for nulo ou indefinido, define o timestamp atual
            if (!message.createdAt) {
              message.createdAt = firestore.FieldValue.serverTimestamp();  // Adiciona o timestamp atual
            }
            return message;
          });
          setMessages(messagesFirestore);
        });

      return () => unsubscribe();
    };

    fetchChat();
  }, [chatId]);

  // Enviar mensagem
  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      text: inputText,
      createdAt: firestore.FieldValue.serverTimestamp(),  // Usando o timestamp do Firestore
      user: { 
        id: user.uid, 
        name: user.displayName, 
        profileImage: userProfileImage || defaultProfileImage  // Usa a imagem do usuário ou a imagem padrão
      }, // Inclui a foto do usuário
    };

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(newMessage);

    // Atualizar o campo 'lastMessage' no documento do chat
    await firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        lastMessage: inputText,
        createdAt: firestore.FieldValue.serverTimestamp(), // Atualiza a data de criação
      });

    setInputText('');  // Limpa o campo de texto após enviar a mensagem
  };

  // Função para formatar a hora da mensagem
  const formatTime = (date) => {
    if (!date) return 'Indefinido';  // Caso o timestamp não seja válido
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Renderizar cada item (mensagem)
  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.user.id === user.uid;  // Verifica se a mensagem é do usuário logado
    
    // Verifica se createdAt existe e é um Timestamp válido
    const messageTime = item.createdAt && item.createdAt.toDate ? formatTime(item.createdAt.toDate()) : 'Indefinido';

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
            source={{ uri: babáProfileImage || defaultProfileImage }}  // Foto do outro usuário ou imagem padrão
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
    flexShrink: 1,
    paddingHorizontal: 10,
    minWidth: 50,
    maxWidth: '80%',
  },
  currentUserMessage: {
    backgroundColor: '#a7d7e6',
    borderBottomRightRadius: 0,
  },
  otherUserMessage: {
    backgroundColor: '#E6E6E6',
    borderBottomLeftRadius: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    alignSelf: 'flex-end',
    marginTop: 5,
    marginLeft: 10,
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

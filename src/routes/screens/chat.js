import React, { useState, useEffect, useCallback, useLayoutEffect} from 'react';
//import {collection, addDoc, orderBy, query, onSnapshot} from '@react-native-firebase/firestore';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatRef = firestore().collection('chats');

  useEffect(() => {
    // Escuta em tempo real para mensagens novas
    const unsubscribe = chatRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
        });
        setMessages(messagesFirestore);
      });

    // Limpeza da escuta
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      text: inputText,
      createdAt: new Date(),
      user: { id: 1, name: 'Você' },
    };

    // Salva a mensagem no Firestore
    await chatRef.add(newMessage);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageUser}>{item.user.name}:</Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem"
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
  },
  messageUser: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  messageText: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
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
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Chat;
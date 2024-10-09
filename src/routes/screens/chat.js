import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { addDoc, collection, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const auth = getAuth();

export const ChatRoom = () => {
  const dummy = useRef();
  const messagesRef = collection(databaseApp, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async () => {
    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp(),
    });

    setFormValue('');
    dummy.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView ref={dummy}>
        {messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
      </ScrollView>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, borderColor: 'gray', borderWidth: 1, padding: 10 }}
          placeholder="Digite sua mensagem..."
          value={formValue}
          onChangeText={setFormValue}
        />
        <Button title="Enviar" onPress={sendMessage} disabled={!formValue} />
      </View>
    </View>
  );
};

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: uid === auth.currentUser.uid ? 'flex-end' : 'flex-start',
        marginVertical: 5,
      }}
    >
      {photoURL && (
        <Image
          source={{ uri: photoURL }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
      )}
      <View
        style={{
          backgroundColor: messageClass === 'sent' ? '#DCF8C6' : '#FFF',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>{text}</Text>
      </View>
    </View>
  );
};


export default Chat;
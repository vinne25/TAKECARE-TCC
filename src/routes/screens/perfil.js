import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Perfil = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      const userId = user.uid;

      const unsubscribe = firestore()
        .collection('Usuarios') // Nome da coleção
        .doc(userId) // Usar userId para acessar o documento
        .onSnapshot((doc) => {
          if (doc.exists) {
            setData({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
            });
          }
          setLoading(false); // Define loading como false após a obtenção dos dados
        });

      // Função de limpeza para cancelar a assinatura
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Indicador de carregamento
  }

  return (
    <View>
      {data ? (
        <Text>{JSON.stringify(data)}</Text> // Renderiza os dados do usuário
      ) : (
        <Text>Nenhum dado disponível</Text>
      )}
    </View>
  );
};

export default Perfil;

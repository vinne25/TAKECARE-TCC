import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Importa diretamente o Firestore
//import auth from '@react-native-firebase/auth';

const Perfil = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const user = auth().currentUser;

    const unsubscribe = firestore()
      .collection('Usuarios') // Nome da coleção
      //.doc(user)
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          nome: doc.data().name,
          cpf: doc.data().cpf,
        }));
        setData(items);
        setLoading(false); // Define loading como false após a obtenção dos dados
      }, (error) => {
        console.error("Erro ao buscar dados: ", error);
        setLoading(false); // Define loading como false em caso de erro
      });

    // Função de limpeza para cancelar a assinatura
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Indicador de carregamento
  }

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{JSON.stringify(item.nome)}</Text> // Renderiza os dados
        )}
      />
    </View>
  );
};

export default Perfil;
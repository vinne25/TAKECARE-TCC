import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator, View, Text } from 'react-native';

// Telas de apresentação
import Pesquisar from './screens/apres';
import Conexoes from './screens/apres2';
import Seguranca from './screens/apres3';
import Login from './screens/login';
import Cadastro from './screens/cadastro';

// Tela principal de navegação por abas
import TabRoutes from './tab.routes';

const Stack = createNativeStackNavigator();

const StackRoutes = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Função para verificar o tipo de usuário na coleção de usuários
  const checkUserType = async (uid) => {
    try {
      console.log('Verificando o tipo de usuário para UID:', uid);
      setLoading(true); // Garantir que o loading comece

      // Verificando se o usuário é uma 'baba'
      const babaDoc = await firestore().collection('Babas').doc(uid).get();
      console.log('Verificando coleção Babas:', babaDoc.exists);

      if (babaDoc.exists) {
        console.log('Usuário é uma baba');
        setUserType('baba');
      } else {
        // Se não for uma 'baba', verificamos se é um 'usuario' normal
        const usuarioDoc = await firestore().collection('Usuarios').doc(uid).get();
        console.log('Verificando coleção Usuarios:', usuarioDoc.exists);

        if (usuarioDoc.exists) {
          console.log('Usuário Contrante');
          setUserType('normal');
        } else {
          console.log('Usuário não encontrado em nenhuma coleção');
          setUserType(null); // Nenhum tipo encontrado
        }
      }
    } catch (error) {
      console.error('Erro ao verificar o tipo de usuário: ', error);
      setUserType(null); // Em caso de erro, não encontra tipo
    } finally {
      console.log('Verificação de tipo de usuário concluída');
      setLoading(false); // Finaliza o loading
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Define o usuário logado
        console.log('Usuário logado:', user);
        checkUserType(user.uid); // Verifica o tipo de usuário após o login
      } else {
        console.log('Nenhum usuário logado');
        setUser(null); // Se o usuário não estiver logado
        setLoading(false); // Finaliza o loading
      }
    });

    return unsubscribe; // Limpeza no unsubscribe
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0BBEE5" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    // Se o usuário não estiver logado, redireciona para as telas de login e cadastro
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Pesquisa" component={Pesquisar} />
        <Stack.Screen name="Conexoes" component={Conexoes} />
        <Stack.Screen name="Seguranca" component={Seguranca} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
      </Stack.Navigator>
    );
  }

  // Se o usuário estiver logado e o tipo de usuário foi encontrado, redireciona para as TabRoutes
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TabRoutes"
        component={TabRoutes}
        initialParams={{ userType }} // Passando o tipo de usuário para TabRoutes
      />
    </Stack.Navigator>
  );
};

export default StackRoutes;

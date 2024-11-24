import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';

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
      const babaDoc = await firestore().collection('Babas').doc(uid).get();
      if (babaDoc.exists) {
        setUserType('baba');
      } else {
        const usuarioDoc = await firestore().collection('Usuarios').doc(uid).get();
        if (usuarioDoc.exists) {
          setUserType('normal');
        } else {
          setUserType(null);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar o tipo de usuário: ', error);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        checkUserType(user.uid); // Verifica o tipo de usuário após o login
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    // Se o usuário não estiver logado, ele é redirecionado para as telas de login e cadastro
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

  // Se o usuário estiver logado, redireciona para as TabRoutes
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

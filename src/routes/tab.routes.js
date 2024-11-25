import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessageCircle, Heart, User, MapPin } from 'react-native-feather';
import React from 'react';
import { View, Text} from 'react-native';
import Mapa from './screens/Mapa';
import Favoritos from './screens/Favoritos';
import Perfil from './screens/perfil';
import PerfilUsuarios from './screens/perfilUsuario';
import Chat from './screens/chat';

const Tab = createBottomTabNavigator();

const TabRoutes = ({ route }) => {
  const { userType } = route.params || {}; // Usando desestruturação para acessar userType

  if (!userType) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando informações do usuário...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#0BBEE5', tabBarInactiveTintColor: 'gray' }}>
      <Tab.Screen
        name="FAVORITOS"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => <Heart stroke={color} width={size} height={size} />,
        }}
      />
      <Tab.Screen
        name="MAPA"
        component={Mapa}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin stroke={color} width={size} height={size} />,
        }}
      />
      <Tab.Screen
        name="CHAT"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => <MessageCircle stroke={color} width={size} height={size} />,
        }}
      />
      {userType === 'baba' ? (
        <Tab.Screen
          name="PERFIL"
          component={Perfil} // Tela de perfil para babá
          options={{
            tabBarIcon: ({ color, size }) => <User stroke={color} width={size} height={size} />,
          }}
        />
      ) : (
        <Tab.Screen
          name="PERFIL"
          component={PerfilUsuarios} // Tela de perfil para usuário normal
          options={{
            tabBarIcon: ({ color, size }) => <User stroke={color} width={size} height={size} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
};


export default TabRoutes;

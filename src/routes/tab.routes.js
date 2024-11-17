import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessageCircle, Heart, User, MapPin } from 'react-native-feather';
import Mapa from './screens/Mapa';
import Favoritos from './screens/Favoritos';
import Perfil from './screens/perfil';
import PerfilUsuarios from './screens/perfilUsuario';
import Chat from './screens/chat';

const Tab = createBottomTabNavigator();

const TabRoutes = ({ route }) => {
  // Verifique se route.params e userType estão definidos
  const userType = route?.params?.userType;

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
          component={PerfilUsuarios} // Tela de perfil para babá
          options={{
            tabBarIcon: ({ color, size }) => <User stroke={color} width={size} height={size} />,
          }}
        />
      ) : (
        <Tab.Screen
          name="PERFIL"
          component={Perfil} // Tela de perfil para usuário normal
          options={{
            tabBarIcon: ({ color, size }) => <User stroke={color} width={size} height={size} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabRoutes;

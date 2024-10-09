import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MessageCircle, Heart, User, MapPin} from 'react-native-feather';

import Mapa from './screens/Mapa';
import Favoritos from './screens/Favoritos';
import Perfil from './screens/perfil';
import Chat from'./screens/chat';


const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#0BBEE5', tabBarInactiveTintColor: 'gray'}}>
      <Tab.Screen name="FAVORITOS" component={Favoritos}
         options={{tabBarIcon: ({ color, size }) => (<Heart stroke={color} width={size} height={size}/>),}}
      />
      <Tab.Screen name="MAPA" component={Mapa}
        options={{tabBarIcon: ({ color, size }) => (<MapPin stroke={color} width={size} height={size}/>),}}
      />
      <Tab.Screen name='CHAT' component={Chat}
        options={{tabBarIcon: ({color, size}) => (<MessageCircle stroke={color} width={size} height={size}/>)}}
      />
      <Tab.Screen name='PERFIL' component={Perfil}
        options={{tabBarIcon: ({color, size}) => (<User stroke={color} width={size} height={size}/>)}}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mapa from './screens/Mapa';
import Favoritos from './screens/Favoritos';
import { Map, Heart, User, MapPin} from 'react-native-feather';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#0BBEE5', tabBarInactiveTintColor: 'gray'}}>
      <Tab.Screen name="MAPA" component={Mapa}
        options={{tabBarIcon: ({ color, size }) => (<MapPin stroke={color} width={size} height={size}/>),}}
      />
      <Tab.Screen name="FAVORITOS" component={Favoritos}
         options={{tabBarIcon: ({ color, size }) => (<Heart stroke={color} width={size} height={size}/>),}}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './screens/Mapa';
import Register from './screens/Favoritos';
import { Feather } from 'react-native-feather';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MAPA" component={Login}/>
      <Tab.Screen name="FAVORITOS" component={Register} />
    </Tab.Navigator>
  );
};

export default TabRoutes;

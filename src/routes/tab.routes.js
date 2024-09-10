import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mapa from './screens/Mapa';
import Favoritos from './screens/Favoritos';
import { Feather } from 'react-native-feather';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MAPA" component={Mapa}/>
      <Tab.Screen name="FAVORITOS" component={Favoritos}/>
    </Tab.Navigator>
  );
};

export default TabRoutes;

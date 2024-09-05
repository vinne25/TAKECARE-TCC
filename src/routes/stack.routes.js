import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/login';
import TabRoutes from './tab.routes';
import Cadastro from './screens/cadastro';

const Stack = createNativeStackNavigator();

const StackRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name= "CADRASTRO" component={Cadastro}/>
      <Stack.Screen name="LOGIN" component={Login} />
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
    </Stack.Navigator>
  );
};

export default StackRoutes;

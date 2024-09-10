import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Pesquisar from './screens/apres';
import Conexoes from './screens/apres2';
import Seguranca from './screens/apres3';
import Login from './screens/login';
import TabRoutes from './tab.routes';
import Cadastro from './screens/cadastro';


const Stack = createNativeStackNavigator();

const StackRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Pesquisa" component={Pesquisar}/>
      <Stack.Screen name="Conexoes" component={Conexoes}/>
      <Stack.Screen name="Seguranca" component={Seguranca}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name= "Cadastro" component={Cadastro}/>
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
    </Stack.Navigator>
  );
};

export default StackRoutes;

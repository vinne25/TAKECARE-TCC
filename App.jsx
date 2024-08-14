//import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Seguranca from './screens/Seguranca';
import conexoes from './screens/Conexoes';
import pesquisar from './screens/pesquisar';
import Login from './screens/login';
import Finalidade from './screens/finalidade';

const Stack = createStackNavigator();

const App = () =>  {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="pesquisar" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Seguranca" component={Seguranca} />
                <Stack.Screen name="Conexões" component={conexoes} />
                <Stack.Screen name="pesquisar" component={pesquisar} />
                <Stack.Screen name='login' component={Login} />
                <Stack.Screen name='finalidade' component={Finalidade} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
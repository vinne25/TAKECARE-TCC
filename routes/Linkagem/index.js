import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Aprs from '../telas/Aprs';
import Aprs2 from '../telas/Aprs2';
import Aprs3 from '../telas/Aprs3';
import Entrar from '../telas/Entrar';
import Finalidades from '../telas/Finalidades';
import TelaCad from '../telas/TelaCad';

const Stack = createStackNavigator();

const Linkagem = () =>  {
    return (
            <Stack.Navigator initialRouteName="Aprs" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Aprs" component={Aprs} />
                <Stack.Screen name="Aprs2" component={Aprs2} />
                <Stack.Screen name="Aprs3" component={Aprs3} />
                <Stack.Screen name="Entrar" component={Entrar} />
                <Stack.Screen name="Finalidades" component={Finalidades}/>
                <Stack.Screen name="TelaCad" component={TelaCad}/>
            </Stack.Navigator>
    );
}

export default Linkagem;
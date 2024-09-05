import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Linkagem from "./routes/Linkagem";

const App = () => {
    return(
        <NavigationContainer>
            <StatusBar backgroundColor="black" barStyle="light-content"/>
            <Linkagem/>
        </NavigationContainer>
    )
}

export default App;
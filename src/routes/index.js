import { NavigationContainer } from "@react-navigation/native";
import BootSplash from 'react-native-bootsplash'
import StackRoutes from "./stack.routes";


const Routes = () =>{
    return(
        <NavigationContainer onReady={() => BootSplash.hide({fade: true})}>
            <StackRoutes />
        </NavigationContainer>
    )
}

export default Routes;
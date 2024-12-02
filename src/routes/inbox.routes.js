import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from './screens/inbox';
import Chat from './screens/chat';

const Stack = createNativeStackNavigator();

const InboxRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="CHAT" component={Chat} />
    </Stack.Navigator>
  );
};

export default InboxRoutes;

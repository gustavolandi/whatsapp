import { NavigationContainer } from "@react-navigation/native";
import ChatsScreen from "../screens/ChatsScreen/ChatsScreen";
import ChatScreen from "../screens/ChatScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import ContactsScreen from "../screens/ContactsScreen";
import NewGroupScreen from "../screens/NewGroupScreen";
import GroupInfoScreen from "../screens/GroupInfoScreen";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chats">
        <Stack.Screen name="Home" component={MainTabNavigator} options={ { headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Group Info" component={GroupInfoScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen}/>
        <Stack.Screen name="New Group" component={NewGroupScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
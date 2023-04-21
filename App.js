import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ChatListItem from './src/components/ChatListItem';

const chat = {
  id: "1",
  user: {
    image: "https://pbs.twimg.com/profile_images/1571527693924958209/sdjOLhmd_400x400.jpg",
    name: "Gustavo Landi"
  },
  lastMessage: {
    text: "Hello there",
    createdAt: "09:17"
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <ChatListItem chat={chat} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

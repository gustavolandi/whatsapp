import { Text, Image, StyleSheet, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import getCommonChatRoomWithUser  from '../../services/chatRoomService';



dayjs.extend(relativeTime);

const ContactListItem = ({ user }) => {
  const navigation = useNavigation();

  const onPress = async () => {
    
    // check if already exists chat room with user

    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      console.log('exists chat');
      navigation.navigate("Chat", { id: existingChatRoom.id });
      return;
    }

    // create a new chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, {input : {}})
    );

    if (!newChatRoomData.data?.createChatRoom){
      console.log("Error creating the chat ");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // add the clicked user to the ChatRoom
    await API.graphql(graphqlOperation(createUserChatRoom, 
      { input: 
        { 
          chatRoomId : newChatRoom.id,
          userId: user.id
        }
      }));

    

    // Add the auth user to the chatroom
    
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(graphqlOperation(createUserChatRoom, 
      { input: 
        { 
          chatRoomId : newChatRoom.id,
          userId: authUser.attributes.sub
        }
      }));

    //navigate to the chat room
      navigation.navigate("Chat", { id: newChatRoom.id });

  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>

        <Text numberOfLines={2} style={styles.subTitle}>
          {user.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: 'center',
  },
  content : {
    flex: 1
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default ContactListItem;
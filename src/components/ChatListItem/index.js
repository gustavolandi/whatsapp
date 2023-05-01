import { Text, View, Image, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect, useState } from 'react';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { onUpdateChatRoom } from '../../graphql/subscriptions';

dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {

    const navigation = useNavigation();

    const [user, setUser] = useState(null);

    const [chatRoom,setChatRoom] = useState(chat);

    useEffect(() => {
        const fetchUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const userItem = chat.users.items.find(item => item.user.id != authUser.attributes.sub);
            setUser(userItem?.user);
        };

        fetchUser();
    },[]);

    useEffect(() => {

        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom,
            { filter: { id: { eq: chat.id}}}
            )).subscribe({
                next : ({value}) => {
                    console.log(value);
                    setChatRoom((cr) => ({
                        ...(cr || {}),
                        ...value.data.onUpdateChatRoom,
                      }));
                },
                error : (err) => console.warn(err),
            });
        return () => subscription.unsubscribe();

    },[]);


    return (
        <Pressable onPress={() => navigation.navigate('Chat', { id: chatRoom.id, name: user?.name })} style={styles.container}>
            <Image 
                source={{ uri: user?.image }} 
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
                  
                    {chat.LastMessage && (
                    <Text style={styles.subtitle}>{dayjs(chatRoom.LastMessage?.createdAt).fromNow()}</Text>)}
                </View>

                <Text numberOfLines={2} style={styles.subTitle}>{chatRoom.LastMessage?.text}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container : {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    content: {
        flex: 1, //fill the view,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5
    },
    name: {
        flex: 1,
        fontWeight: 'bold'
    },
    subTitle: {
        color: 'gray'
    }
});

export default ChatListItem;
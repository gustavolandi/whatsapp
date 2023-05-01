import { StyleSheet, KeyboardAvoidingView, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import Message from '../components/Message';
import bg from '../../assets/images/BG.png'
import InputBox from '../components/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries';
import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions'

const ChatScreen = () => {

    const [chatRoom,setChatRoom] = useState(null);
    const [messages,setMessages] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();
    const chatroomID = route.params.id;
    const [show,setShow] = useState(false);

    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(result => {
            setChatRoom(result.data?.getChatRoom);
        });
        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom,
            { filter: { id: { eq: chatroomID}}}
            )).subscribe({
                next : ({value}) => {
                    setChatRoom((cr) => ({
                        ...(cr || {}),
                        ...value.data.onUpdateChatRoom,
                      }));
                },
                error : (err) => console.warn(err),
            });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID, sortDirection: "DESC" })).then(result => {
            setMessages(result.data?.listMessagesByChatRoom?.items);
            setShow(true);
        });
        
        const subscription = API.graphql(graphqlOperation(
            onCreateMessage, 
            {
            filter : { chatroomID : { eq: chatroomID}}
            }
            )).subscribe({
            next : ({value}) => {
                console.log(value);
                setMessages(m => [value.data.onCreateMessage, ...m]);
            },
            error : (err) => console.warn(err)
        });
        return () => subscription.unsubscribe();
    }, [chatroomID]);


    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    if (!show) {
        return <ActivityIndicator/>;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
            style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList 
                    data={messages}
                    renderItem={({item}) => <Message message={item}></Message>}
                    style={styles.list}
                    inverted
                />
                <InputBox chatroom={chatRoom}/>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles= StyleSheet.create({
    bg: {
        flex: 1
    },
    list: {
        padding: 10
    }
})

export default ChatScreen;
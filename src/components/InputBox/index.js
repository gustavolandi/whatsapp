import { View, TextInput, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../graphql/mutations';

const InputBox = ({ chatroom }) => {

    const [text, setText] = useState('');

    const onSend = async () => {
        const authUser = await Auth.currentAuthenticatedUser();

        const newMessageInput = {
            chatroomID: chatroom.id,
            text: text,
            userID: authUser.attributes.sub
        };

        const newMessageData = await API.graphql(graphqlOperation(createMessage, {input : newMessageInput}));

        setText("");

        await API.graphql(graphqlOperation(updateChatRoom,{input : {
            _version: chatroom._version,
            chatRoomLastMessageId: newMessageData.data.createMessage.id,
            id: chatroom.id
        }}))
      };

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <AntDesign name='plus' size={24} color='royalblue' />

            <TextInput
                value={text}
                onChangeText={setText}
                style={styles.input} 
                multiline
            />
            <MaterialIcons onPress={onSend} style={styles.send} name='send' size={24} color='white'/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        padding: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    input : {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,

        borderRadius: 50,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,

    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden',

    }
});

export default InputBox;
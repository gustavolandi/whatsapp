import { View, TextInput, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import { useState } from 'react';

const InputBox = () => {

    const [newMessage, setNewMessage] = useState('');

    const onSend = () => {
        console.warn("Send a new message",newMessage);
        setNewMessage("");
      };

    return (
        <View style={styles.container}>
            <AntDesign name='plus' size={24} color='royalblue' />

            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                style={styles.input} 
                multiline
            />
            <MaterialIcons onPress={onSend} style={styles.send} name='send' size={24} color='white'/>
        </View>
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
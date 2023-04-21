import { StyleSheet, KeyboardAvoidingView, ImageBackground, FlatList } from 'react-native';
import Message from '../components/Message';
import messages from '../../assets/data/messages.json'
import bg from '../../assets/images/BG.png'
import InputBox from '../components/InputBox';

const ChatScreen = () => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList 
                    data={messages}
                    renderItem={({item}) => <Message message={item}></Message>}
                    style={styles.list}
                    inverted
                />
                <InputBox/>
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
import { StyleSheet, View, Text, ImageBackground, FlatList } from 'react-native';
import Message from '../components/Message';
import messages from '../../assets/data/messages.json'
import bg from '../../assets/images/BG.png'

const ChatScreen = () => {
    return (
        <ImageBackground source={bg} style={styles.bg}>
            <FlatList 
                data={messages}
                renderItem={({item}) => <Message message={item}></Message>}
                style={styles.list}
                inverted
            />
        </ImageBackground>
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
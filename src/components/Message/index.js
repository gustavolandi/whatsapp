import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import { Auth, Storage } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { S3Image } from 'aws-amplify-react-native/dist/Storage';
import ImageView from 'react-native-image-viewing';

dayjs.extend(relativeTime);


const Message = ({message}) => {

    const [isAuthUser,setIsAuthUser] = useState(false);
    const [imageViewerVisible,setImageViewerVisible] = useState(false);
    const [imageSources,setImageSourcers] = useState([]);

    useEffect(() => {
        const isMyMessage = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            setIsAuthUser(message.userID === authUser.attributes.sub);
        };
    
        isMyMessage();
    }, []);

    useEffect(() => {
        const downloadImages = async () => {
            if (message.images?.length > 0) {
                if (message.images[0] != null) {
                    const uri = await Storage.get(message.images[0]);
                    setImageSourcers([{ uri }])
                }
            }
        }

        downloadImages();
    }, [message.images]);

    console.log(imageSources);

    return (
        <View style={[styles.container,
        {
            backgroundColor: isAuthUser ? '#dcf8c5' : 'white',
            alignSelf: isAuthUser ? 'flex-end' : 'flex-start'
        }
        ]}>
        {imageSources[0] != null && (
            <>
                <Pressable onPress={() => setImageViewerVisible(true)}>
                    <Image source={imageSources[0]} style={styles.image}/>
                </Pressable>
                <ImageView
                    images={imageSources} 
                    imageIndex={0} 
                    visible={imageViewerVisible} 
                    onRequestClose={() => setImageViewerVisible(false)}
                />
            </>
        )}
        <Text>{message.text}</Text>
        <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
    );
};

const styles = StyleSheet.create({
    container:{
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1
    },
    time: {
        color: 'gray',
        alignSelf: 'flex-end'
    },
    image: {
        width: 200,
        height: 100,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 5,
      },
});

export default Message;

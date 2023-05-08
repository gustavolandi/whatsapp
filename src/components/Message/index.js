import { Text, View, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native';
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

    const {width} = useWindowDimensions(); 

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

                // const uri = await Storage.get(message.images[0]);

                const uris = await Promise.all(message.images.map(Storage.get));
                setImageSourcers(uris.map((uri) => ({ uri })));
                
            }
        }

        downloadImages();
    }, [message.images]);

    const imageContainerWidth = width * 0.8 - 30;

    return (
        <View style={[styles.container,
        {
            backgroundColor: isAuthUser ? '#dcf8c5' : 'white',
            alignSelf: isAuthUser ? 'flex-end' : 'flex-start'
        }
        ]}>
        {imageSources.length > 0 && (
            <View style={[{ width: imageContainerWidth }, styles.images]}>
            {imageSources.map((imageSource) => (
                <Pressable style={[
                    styles.imageContainer,
                    imageSources.length === 1 && { flex: 1 },
                  ]}
                    onPress={() => setImageViewerVisible(true)}>
                    <Image source={imageSource} style={styles.image}/>
                </Pressable>))}
                <ImageView
                    images={imageSources} 
                    imageIndex={0} 
                    visible={imageViewerVisible} 
                    onRequestClose={() => setImageViewerVisible(false)}
                />
            </View>
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
        flex: 1,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
      },
      images : {
        flexDirection: "row",
        flexWrap: "wrap",
      },
      imageContainer : {
        width: "50%",
        padding: 3,
        aspectRatio: 1
      }
});

export default Message;

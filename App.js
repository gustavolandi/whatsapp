import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './src/navigation';

import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native';

import awsconfig from './src/aws-exports'
import { useEffect } from 'react';
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

//disable analytics
Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {

  useEffect(() => {
    const syncUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      
      const userData = await API.graphql(graphqlOperation(getUser,{ id: authUser.attributes.sub }));

      if (userData.data.getUser){
        console.log("User already exists in DB");
        return;
      }

      const newUser = {
        id: authUser.attributes.sub,
        name: authUser.attributes.phone_number,
        status: "Hey, I am using WhatsApp"
      };

      const newUserResponse = await API.graphql(graphqlOperation(createUser, { input: newUser}));


    };

    syncUser();
  }, []);

  return (
    <View style={styles.container}>
      <Navigator/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App);
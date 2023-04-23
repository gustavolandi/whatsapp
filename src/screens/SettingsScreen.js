import { View, Button, StyleSheet } from "react-native";
import { Auth } from "aws-amplify";

const SettingsScreen = () => {

  const onPress=() => {
    Auth.signOut();
  };

  return (
    <View style={styles.container}>
       <Button onPress={onPress} title="Sign out"/>
    </View>
  );
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default SettingsScreen;
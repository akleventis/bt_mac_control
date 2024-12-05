import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';

export default function HomeScreen() {
  const sendPostRequest = async () => {
    try {
      const response = await fetch('http://10.0.0.144:8000', {
        method: 'POST',
      });

      if (response.ok) {
        return
      } else {
        Alert.alert('Error', `Failed to send request: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send request: ${(error as Error) .message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h_text}>Hi Tanner</Text>
      <Image
        source={require('../assets/images/t_dawg.jpeg')}
        style={styles.img}
      />
      <Button
        title="click me"
        onPress={sendPostRequest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  h_text: {
    fontSize: 50
  },
  img: {
    width: 200,
    height: 200
  }
});
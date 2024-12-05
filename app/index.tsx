import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h_text}>Hi Tanner</Text>
      <Image
        source={require('../assets/images/t_dawg.jpeg')}
        style={styles.img}
      />
      <Button
        title="click me"
        onPress={() => Alert.alert('clicked')} />
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
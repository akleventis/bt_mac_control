import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';

const subnet = '10.0.0';

  export default function HomeScreen() {
    const [serverIP, setServerIP] = useState('');

    useEffect(() => {
      const scanNetwork = async () => {
        const ips = Array.from({ length: 255 }, (_, i) => `${subnet}.${i + 1}`); // Generate all possible IPs
        const controllers: AbortController[] = [];
        let found = false;
    
        const fetchIP = async (ip: string) => {
          if (found) return; 
          const controller = new AbortController();
          controllers.push(controller);
    
          const timeoutId = setTimeout(() => controller.abort(), 1000);
    
          try {
            console.log(`Checking ${ip}`);
            const response = await fetch(`http://${ip}:5001/discover`, {
              method: 'GET',
              signal: controller.signal,
            });
    
            clearTimeout(timeoutId);
    
            if (response.ok && !found) {
              found = true;
              setServerIP(ip);
    
              // abort all pending requests
              controllers.forEach((ctrl) => ctrl.abort());
            }
          } catch {
            clearTimeout(timeoutId);
          }
        };
    
        const requests = ips.map((ip) => fetchIP(ip));
    
        await Promise.allSettled(requests); // clean up
      };
    
      scanNetwork();
    }, []);

    console.log(serverIP)


  const sendRequest = async (action: string) => {
    try {
      const response = await fetch(`http://${serverIP}:5001/${action}`, {
        method: 'GET',
      });

      if (response.ok) {
        return
      } else {
        Alert.alert('Error', `Failed to send request: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send request: ${(error as Error).message}`);
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
        title="play/pause"
        onPress={() => sendRequest("play")} />
      <Button
        title="left arrow key"
        onPress={() => sendRequest("left_arrow")} />
      <Button
        title="right arrow key"
        onPress={() => sendRequest("right_arrow")} />
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
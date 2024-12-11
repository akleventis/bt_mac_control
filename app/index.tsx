import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, Alert } from 'react-native';

// ----------------------- TOOPER ----------------------- //
// TODO: Expo restricts usage of react-native npm packages, eject & use https://www.npmjs.com/package/react-native-zeroconf for network discovery. However, this eliminates the Expo Go app for live ui updates 

// The 10.0.0.x range is commonly used most out of the box network setups.
// This app is currently restricted from discovering ip's outside of that range. 
const subnet = '10.0.0';
// Manually add IP in the overrideIP variable below to skip network scan
const overrideIP = ''
// set client <-> server port
const port = 5001;

// valid http methods for request
type HttpMethod = "GET" | "POST" // ...etc

// sendRequest is a helper function that sends a general http request and returns the full response
let sendRequest = async (method: HttpMethod, endpoint: string, ip: string, signal?: AbortSignal): Promise<Response> => {
  const response = await fetch(`http://${ip}:${port}/${endpoint}`, {
    method: method,
    signal: signal,
  });
  return response
}

// scanNetwork scans the local network for devices by sending /discover ping requests to potential IPs rangin from 10.0.0.1 -> 10.0.0.255
// If a valid response is received, it sets the discovered IP using the provided setServerIP state updater function in the HomeScreen component)
const scanNetwork = async (setServerIP: React.Dispatch<React.SetStateAction<string>>) => {
  // array of all possible ip's in subnet 0 - 255
  const ips = Array.from({ length: 255 }, (_, i) => `${subnet}.${i + 1}`);   // ["10.0.0.1", "10.0.0.2", ..., "10.0.0.255"]

  // controllers store AbortController instances for managing ongoing network requests
  const controllers: AbortController[] = [];

  // found flips to true when an ip is found, stopping subsequent fetch attempts
  let found = false;
 
  // fetchIP is an async function that sends a request to http://10.0.0.{ip}:5001/discover
  // if a request receives a valid response, it aborts all controllers running in parallel 
  const fetchIP = async (ip: string) => {
    if (found) return;
    const controller = new AbortController();
    controllers.push(controller);
    
    // abort after .5 second, lookup should be quick
    const timeoutId = setTimeout(() => controller.abort(), 500);
    
    try {
      let response = await sendRequest("GET", "discover_ping", ip, controller.signal)
      clearTimeout(timeoutId);

      // If a valid response is received and no IP has been found yet
      if (response.ok && !found) {
        found = true;
        setServerIP(ip);

        // abort all pending network requests
        controllers.forEach((ctrl) => ctrl.abort());
      }
    } catch {
      // if there's an error, ignore and clear timeout
      clearTimeout(timeoutId);
    }
  };

  // create array of fetchIP functions ranging from ip = 1 to 255
  const requests = ips.map((ip) => fetchIP(ip));

  // allSettle vs all: we want to until all requests have been completed, even if some fail
  await Promise.allSettled(requests);
};

// triggerKeyPress sends the keypress action to the /key endpoint in server.py
const triggerKeyPress = async (serverIP: string, key_action: string) => {
  try {
    const endpoint = `key?action=${key_action}`
    const response = await sendRequest("GET", endpoint, serverIP);
    if (!response.ok) {
      Alert.alert('Error', `Failed to send request: ${response.status}`);
    }
  } catch (error) {
    Alert.alert('Error', `Failed to send request: ${(error as Error).message}`);
  }
};

// reScan scans the network again for /discovery_ping response in case of new network location
const reScan = (i: number, incrRescan: React.Dispatch<React.SetStateAction<number>>) => {
  incrRescan(i + 1)
  console.log("...rescanning")
}

export default function HomeScreen() {
  const [serverIP, setServerIP] = useState('no ip set');
  const [i, incrRescan] = useState(0)

  // allow override on known network
  useEffect(() => {
    if (overrideIP) {
      setServerIP(overrideIP);
    } else {
      scanNetwork(setServerIP);
    }
  }, [overrideIP, i]);


  // ----------------------- Cheeze-Dawg ----------------------- //
  return (
    <View style={styles.container}>
      <Text style={styles.h_text}>IP: {serverIP}</Text>
      <Button
        title="play/pause"
        onPress={() => triggerKeyPress(serverIP, "play_pause")} />
      <Button
        title="left arrow key"
        onPress={() => triggerKeyPress(serverIP, "left_arrow")} />
      <Button
        title="right arrow key"
        onPress={() => triggerKeyPress(serverIP, "right_arrow")} />
      <Button
        title="brightness up"
        onPress={() => triggerKeyPress(serverIP, "brightness_up")} />
      <Button
        title="brightness down"
        onPress={() => triggerKeyPress(serverIP, "brightness_down")} />
      <Button
        title="volume up"
        onPress={() => triggerKeyPress(serverIP, "volume_up")} />
      <Button
        title="volume down"
        onPress={() => triggerKeyPress(serverIP, "volume_down")} />
      <Button
        title="rescan"
        onPress={(() => reScan(i, incrRescan))} />
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
    fontSize: 30
  },
  img: {
    width: 200,
    height: 200
  }
});
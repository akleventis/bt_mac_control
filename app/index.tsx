import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { scanNetwork, triggerKeyPress, reScan } from "./api";

// manually add ip in the overrideIP variable below to skip network scan
const overrideIP = ''

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
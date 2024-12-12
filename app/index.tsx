import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { scanNetwork, triggerKeyPress, adjustVolume, reScan } from "./api";

// manually add ip in the overrideIP variable below to skip network scan
const overrideIP = ''

export default function HomeScreen() {
  const [serverIP, setServerIP] = useState('nil');
  const [volume, setVolume] = useState("")
  const [i, incrRescan] = useState(0)

  // allow override on known network
  useEffect(() => {
    if (overrideIP) {
      setServerIP(overrideIP);
    } else {
      scanNetwork(setServerIP);
    }
  }, [overrideIP, i]);

  // fetch current volume from server
  useEffect(() => {
    if (serverIP !== 'nil') {
      adjustVolume(serverIP, "current", setVolume);
    }
  }, [serverIP]); 

  return (
    <View style={styles.container}>
      <Text style={styles.h_text}>IP: {serverIP}</Text>
      <Button
        title="play/pause"
        onPress={() => triggerKeyPress(serverIP, "play_pause")} />
      <Button
        title="previous track"
        onPress={() => triggerKeyPress(serverIP, "previous_track")} />
      <Button
        title="next track"
        onPress={() => triggerKeyPress(serverIP, "next_track")} />
      <Button
        title="left arror key"
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
        onPress={() => adjustVolume(serverIP, "volume_up", setVolume)} />
      <Button
        title="volume down"
        onPress={() => adjustVolume(serverIP, "volume_down", setVolume)} />
      <Button
        title="rescan"
        onPress={(() => reScan(i, incrRescan))} />
      <Text>volume: {volume}</Text>
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
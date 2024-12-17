import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { scanNetwork, triggerKeyPress, adjustVolume, reScan } from './api';
import { ImagesAssets } from '../assets/ImagesAssets';

// manually add ip in the overrideIP variable below to skip network scan
const overrideIP = '';

export default function HomeScreen() {
  const [serverIP, setServerIP] = useState('nil');
  const [volume, setVolume] = useState('');
  const [i, incrRescan] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
      adjustVolume(serverIP, 'current', setVolume);
    }
  }, [serverIP]);

  function setPlayButton() {
    triggerKeyPress(serverIP, 'play_pause');
    setIsPlaying(!isPlaying);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.h_text}>IP: {serverIP}</Text>

        <View style={styles.row}>
          <Pressable onPress={() => triggerKeyPress(serverIP, 'left_arrow')}>
            <Image style={styles.item} source={ImagesAssets.Left} />
          </Pressable>

          <Pressable onPress={() => triggerKeyPress(serverIP, 'right_arrow')}>
            <Image style={styles.item} source={ImagesAssets.Right} />
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            onPress={() => triggerKeyPress(serverIP, 'previous_track')}
          >
            <Image style={styles.item} source={ImagesAssets.Previous} />
          </Pressable>

          <Pressable onPress={setPlayButton}>
            {isPlaying ? (
              <Image style={styles.item} source={ImagesAssets.Play} />
            ) : (
              <Image style={styles.item} source={ImagesAssets.Pause} />
            )}
          </Pressable>

          <Pressable onPress={() => triggerKeyPress(serverIP, 'next_track')}>
            <Image style={styles.item} source={ImagesAssets.Next} />
          </Pressable>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.column}>
            <Pressable
              onPress={() => triggerKeyPress(serverIP, 'brightness_up')}
            >
              <Image style={styles.item} source={ImagesAssets.BrightnessUp} />
            </Pressable>

            <Pressable
              onPress={() => triggerKeyPress(serverIP, 'brightness_down')}
            >
              <Image style={styles.item} source={ImagesAssets.BrightnessDown} />
            </Pressable>
          </View>

          <Pressable onPress={() => reScan(i, incrRescan)}>
            <Image style={styles.item} source={ImagesAssets.Rescan} />
          </Pressable>

          <View style={styles.column}>
            <Pressable
              onPress={() => adjustVolume(serverIP, 'volume_up', setVolume)}
            >
              <Image style={styles.item} source={ImagesAssets.VolumeUp} />
            </Pressable>

            <Pressable
              onPress={() => adjustVolume(serverIP, 'volume_down', setVolume)}
            >
              <Image style={styles.item} source={ImagesAssets.VolumeDown} />
            </Pressable>
          </View>
        </View>

        <Text>volume: {volume}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 55,
    marginBottom: 55,
  },
  h_text: {
    fontSize: 30,
  },
  img: {
    width: 200,
    height: 200,
  },
  item: {
    width: 50,
    height: 50,
    color: 'red',
    margin: 10,
    padding: 7,
    borderWidth: 3,
    borderRadius: 50,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 80,
    marginRight: 80,
  },
});

# IOS remote control for mac
App that allows your phone to trigger certain keypress / os events on a corresponding mac. Created to prevent having to walk over to computer while connected to TV through a physical HDMI cord. Primary for use when streaming media from comptuer to TV. 

## Overview
- python server runs on computer, allows access to os operations (mac)
- react-native client connected to same network (phone)
- network discovery: client cycles through ip's within range 10.0.0.0 - 10.0.0.255 until a response is receieved 
   - Note: would like to use zeroconf, using react-native npm packages won't work with expo go
   - Improvement: eject & use [react-native-zeroconf](https://www.npmjs.com/package/react-native-zeroconf) for network discovery
- once ip address of server is found, we can send key press requests to the server from our phone through http over tcp/ip

Current keypress actions
- play/pause
- brightness up/down
- volume up/down
- left/right arrow key press

> We may want to change the repo name as we're not using a bluetooth connection to handle phone <-> computer interaction. 

## Setup
1. Clone repository

1. Install npm dependencies
   -  `npm install`

1. Install Python 3.9+ on system

1. Set up a virtual environment using pyenv 
   - `brew install pyenv`
   - `pyenv virtualenv 3.9.6 bt_mac_control_env`
   - `pyenv local bt_mac_control_env`

1. Enable keyboard accessibility
   1.	Open System Settings > Privacy & Security > Accessibility.
   1. Enable hidden files in Finder:
      - Press Cmd + Shift + . in the file selection dialog.
   1. Navigate to the global path:
      - `~/.pyenv/versions/bt_mac_control_env/bin/python`
   1.	Drag and drop to the list.

1. Install required packages
   - `pip install -r bt_mac_control/python/requirements.txt`
   
1. Download and configure Hammerspoon
- The F8 key is typically mapped to the Play/Pause command, but using AppleScript to control playback requires targeting specific applications (e.g., iTunes, Spotify).
- Hammerspoon allows overriding F8 and other media keys for a universal solution, avoiding application-specific dependencies.
- See: [hammerspoon.org](https://www.hammerspoon.org/) & [github download link](https://github.com/Hammerspoon/hammerspoon/releases/tag/1.0.0)
- After installation, open the Configuration by clicking Open Config in the Hammerspoon menu. Copy this into the init.lua file (example in directory)
```lua
-- Simulate Media Play/Pause Key
hs.hotkey.bind({}, "F8", function()
    hs.eventtap.event.newSystemKeyEvent("PLAY", true):post()
    hs.eventtap.event.newSystemKeyEvent("PLAY", false):post()
end)
```
> remaps the F8 key to trigger the universal Play/Pause media action

8. Update [start_app.sh](start_app.sh) permissions
   - bash script responsible for spinning up the expo & python servers
   - `chmod +x start_app.sh`

## Run app

 command | description
---------|------------
`./start_app.sh`|script which spins up expo go & python server
`npx expo start`|spins up expo go
`python server.py`|starts python server

> Note: You may need to update [start_app.sh](start_app.sh) permissions to make executable: `chmod +x start_app.sh`

Bash alias for ease of running in any working dir `alias mac_remote='./path/to/bt_mac_control/start_app.sh';`

---

Resources:
- [Expo Go](https://expo.dev/go)
- [file-based routing](https://docs.expo.dev/router/introduction)
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

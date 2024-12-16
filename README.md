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
- prev/next track
- brightness up/down
- volume up/down
- left/right arrow key press

> We may want to change the repo name as we're not using a bluetooth connection to handle phone <-> computer interaction. 

## Mac OS Setup
1. Clone repository `git clone https://github.com/akleventis/bt_mac_control.git`

1. We're going to be running a python server on this device that listens for http events; triggerring operating system keypresses accordingly. 

1. Ensure `python3` is intalled on system 
   - `brew install python`: installs the latest Python 3 version
   - `python3 --version`: returns the python version (ex. `Python 3.9.6`)

1. Ensure `pyenv`is installed on system
   - `brew install pyenv`: installs the latest pyenv version
   - `pyenv --version`: returns pyenv version

1. Ensure virtualenv is installed
   - `pip3 install virtualenv`
   - `virtualenv --version`

1. Ensure pyenv-virtual is installed
   - `brew install pyenv-virtualenv`

1. Set up a virtual environment using pyenv 
   - `pyenv virtualenv 3.9.6 bt_mac_control_env`
     - replace `3.9.6` with current python version
     - creates virtual environment
   - `pyenv local bt_mac_control_env`
     - ensures it's auto-activated when working in project directory
   - verify VSCode inerpretter is set to bt_mac_control_env

1. Enable keyboard accessibility
   1.	Open System Settings > Privacy & Security > Accessibility.
   1. Open finder and enable hidden files
      - Enter `Cmd + Shift + .` in the file selection dialog.
   1. Navigate to the global path of python virtual environment:
      - `~/.pyenv/versions/bt_mac_control_env/bin/python`
   1.	Drag and drop to the list.

1. Install required packages located in [requirments.txt](./python/requirements.txt)
   - `pip install -r python/requirements.txt`

1. Install npm dependencies
   -  `npm install`
   

1. Download and configure [Hammerspoon](https://www.hammerspoon.org/)
> Oof antoher depedency?.. so sry... media controls proved to be quite tricky.

- Keypresses are triggered through Applescript, an apple scripting language that allows for control over some OS functions. For example, `brightness up` corresponds to a key code of `144`.
- Below, we are telling our System Events to trigger key 144, which will increment the brightness on your computer up a notch. 

```bash
#!/bin/bash
osascript -e "tell application \"System Events\" to key code 144"
```

|Function key|Media key|
-|-
|F7|previous|
|F8|play/pause|
|F9|next|

These media controls are unique because they don’t use traditional key codes. For example, sending the key code for F8 (144) through AppleScript won’t trigger the play/pause action — it only simulates pressing the F8 key. This is because macOS handles media keys as system-level events, separate from standard key presses. 
  - Hammerspoon overcomes this limitation by directly sending system-level Play/Pause, Next, and Previous commands
  - It grants us the ability to trigger the play/pause system event through key bindings.


> Note: Once enabled, this will override the default functionality of F7, F8, and F9. You can disable Hammerspoon anytime to restore their original behavior.

- [download link](https://github.com/Hammerspoon/hammerspoon/releases/tag/1.0.0)
- After installation, open the app and follow steps allowing accessibility.
- click *Open Config* in the Hammerspoon menu. Copy this into the [init.lua](./init.lua)
```lua
-- Simulate Media Previous Track Key (F7)
hs.hotkey.bind({}, "F7", function()
    hs.eventtap.event.newSystemKeyEvent("PREVIOUS", true):post()
    hs.eventtap.event.newSystemKeyEvent("PREVIOUS", false):post()
end)

-- Simulate Media Play/Pause Key (F8)
hs.hotkey.bind({}, "F8", function()
    hs.eventtap.event.newSystemKeyEvent("PLAY", true):post()
    hs.eventtap.event.newSystemKeyEvent("PLAY", false):post()
end)

-- Simulate Media Next Track Key (F9)
hs.hotkey.bind({}, "F9", function()
    hs.eventtap.event.newSystemKeyEvent("NEXT", true):post()
    hs.eventtap.event.newSystemKeyEvent("NEXT", false):post()
end)
```
> remaps the F8 key to trigger the universal Play/Pause media action

- click 'Reload Config' in the hammerspoon menu

## IOS Setup
- Download [Expo Go](https://expo.dev/go) in the app store 
- Scan QR Code when it appears on screen upon running the app

## Run app
- Spin up Hammerspoon daemon
Here’s the fixed table:

| Command  | Description |
| -------- | ----------- |
| npx expo start | npx expo start	Spins up the Expo Go environment. |
| python server.py | Starts the Python server. |
| ./start_app.sh | Script that starts both Expo Go and the Python server. |

> Note: You may need to update [start_app.sh](start_app.sh) permissions to make executable: `chmod +x start_app.sh`

### Bash alias for ease of running in any working dir 
- Add this line to your ~/.zshrc (or ~/.bashrc)
  - `alias mac_remote='./path/to/bt_mac_control/start_app.sh';`
- Expo & Python server will spin up with a single command `mac_remote`
- Scan the qr code or nav to recent project on IOS device for remote control

---

Resources:
- [Expo Go](https://expo.dev/go)
- [file-based routing](https://docs.expo.dev/router/introduction)
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

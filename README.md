## Expo
1. Install dependencies
   - > npm install

1. Start app
   - > npx expo start

Resources:
- [Expo Go](https://expo.dev/go)
- [file-based routing](https://docs.expo.dev/router/introduction)
- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Python Server

1. Prerequisites
   - Python 3.9+ installed on system.

1. Pip install requirements
   - > pip install -r bt_mac_control/python/requirements.txt

1. Set up a virtual environment using pyenv 
   - > pyenv virtualenv 3.9.6 bt_mac_control_env
   - > pyenv local bt_mac_control_env

TODO: Pipfile.lock

1.  Spin up server > `python python/server.py`
## Enable keyboard accessibility 
1.	Open System Settings > Privacy & Security > Accessibility.
1. Enable hidden files in Finder:
   - Press Cmd + Shift + . in the file selection dialog.
1. Navigate to the global path:
   - `~/.pyenv/versions/bt_mac_control_env/bin/python`
1.	Drag and drop to the list.

## Install Hammerspoon
- Hammerspoon allows us to override special media keys like Play/Pause, which do not directly correspond to standard key codes
- See: [hammerspoon.org](https://www.hammerspoon.org/) & [github download link](https://github.com/Hammerspoon/hammerspoon/releases/tag/1.0.0)
- After installation, open the Configuration by clicking Open Config in the Hammerspoon menu. Copy this into the init.lua file (example in directory)
```lua
-- Simulate Media Play/Pause Key
hs.hotkey.bind({}, "F8", function()
    hs.eventtap.event.newSystemKeyEvent("PLAY", true):post()
    hs.eventtap.event.newSystemKeyEvent("PLAY", false):post()
end)
```
> remaps the F8 key to trigger the Play/Pause & Sound Up/Down media action

Yo tanner I'm starting app bare bones af. Let's get basics implemented before getting too fancy with all of expos capabilities


## Expo

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Running Python

1. Prerequisites
   - Ensure you have Python 3.9 or later installed on your system.
   - Spin up server: `python python/discover.py`

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
- After installation, open the Configuration by clicking Open Config in the Hammerspoon menu. Copy this into the init.lua file
```lua
-- Simulate Media Play/Pause Key
hs.hotkey.bind({}, "F8", function()
    hs.eventtap.event.newSystemKeyEvent("PLAY", true):post()
    hs.eventtap.event.newSystemKeyEvent("PLAY", false):post()
end)
```
> remaps the F8 key to trigger the Play/Pause media action

## Documentation
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Components](https://reactnative.dev/docs/button) React native components 


https://weblog.rogueamoeba.com/2007/09/29/
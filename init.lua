-- Simulate Media Play/Pause Key
hs.hotkey.bind({}, "F8", function()
    hs.eventtap.event.newSystemKeyEvent("PLAY", true):post()
    hs.eventtap.event.newSystemKeyEvent("PLAY", false):post()
end)

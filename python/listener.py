from pynput.keyboard import Key, Controller
import socket, os

keyboard = Controller()

# simple local network websocket 
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8000))
server.listen(5)

print("Listening for commands...")

def simulate_media_key(key_code):
    print("simulate_media_key")
    os.system(f'osascript -e "tell application \\"System Events\\" to key code {key_code}"')  # F8 key

try:
    while True:
        client, addr = server.accept()
        command = client.recv(1024).decode('utf-8')
        print(f"Received command: {command}")
        simulate_media_key(100)
except KeyboardInterrupt:
    print("Shutting down server...")
    client.close()
    server.close()


# curl -XPOST 'http://10.0.0.144:8000'
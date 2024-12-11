from flask import Flask, jsonify, request
import os, socket, subprocess, logging

app = Flask(__name__)

KEY_MAPPING = {
    "play_pause": 100,
    "left_arrow": 123,
    "right_arrow": 124,
    "brightness_up": 144,
    "brightness_down": 145,
}

def get_current_volume():
    script = 'output volume of (get volume settings)'
    result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
    return int(result.stdout.strip())

def set_volume(volume_level):
    script = f'set volume output volume {volume_level}'
    subprocess.run(['osascript', '-e', script])

def adjust_volume(command):
    current_volume = get_current_volume()
    app.logger.info(current_volume)

    if command == 'up':
        new_volume = min(current_volume + 10, 100) 
    elif command == 'down':
        new_volume = max(current_volume - 10, 0)   
    else:
        return 
    set_volume(new_volume)

OS_KEY_MAPPING = {
    "volume_up": lambda: adjust_volume("up"),
    "volume_down": lambda: adjust_volume("down")
}

def simulate_keypress(key_code):
    os.system(f'osascript -e "tell application \\"System Events\\" to key code {key_code}"')

@app.route('/discover_ping')
def get_ip():
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return jsonify({'ip_address': local_ip}), 200

@app.route('/key')
def key_action():
    action = request.args.get('action')

    if action in KEY_MAPPING:
        key_code = KEY_MAPPING[action]
        simulate_keypress(key_code)
        return jsonify({'status': f'{action} press'}), 200
    
    if action in OS_KEY_MAPPING:
        resp = OS_KEY_MAPPING[action]()
        return jsonify({'status': f'{resp}'}), 200
    
    return jsonify({'error': 'Invalid or missing action'}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
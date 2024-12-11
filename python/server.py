from flask import Flask, jsonify, request
from handlers import KEY_MAPPING, OS_KEY_MAPPING, handleGetIP, handleKeyPress, handleCustomOSAction

app = Flask(__name__)

@app.route('/discover_ping')
def get_ip():
    response = handleGetIP()
    return jsonify(response), 200

@app.route('/os_action')
def key_action():
    action = request.args.get('action')

    if action in KEY_MAPPING:
        response = handleKeyPress(action)
        return jsonify(response), 200
    
    if action in OS_KEY_MAPPING:
        response = handleCustomOSAction(action)
        return jsonify(response), 200
    
    return jsonify({'error': 'Invalid or missing action'}), 400

@app.errorhandler(404)
def not_found():
    return jsonify({'error': 'Not Found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
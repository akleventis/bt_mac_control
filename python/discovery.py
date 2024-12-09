import http.server
import socket
import os
import json


class DiscoveryHandler(http.server.BaseHTTPRequestHandler):
    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # CORS Header
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def simulate_keypress(self, key_code):
        os.system(f'osascript -e "tell application \\"System Events\\" to key code {key_code}"')

    def do_GET(self):
        if self.path == '/discover':
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            self.send_json_response(200, {'ip_address': local_ip})
            return
        if self.path == '/play':
            self.simulate_keypress(100)
            self.send_json_response(200, {'status': 'playing'})
            return
        if self.path == '/left_arrow':
            self.simulate_keypress(123)
            self.send_json_response(200, {'status': 'left arrow press'})
            return
        if self.path == '/right_arrow':
            self.simulate_keypress(124)
            self.send_json_response(200, {'status': 'right arrow press'})
            return
        if self.path == '/brightness_up':
            self.simulate_keypress(144)
            self.send_json_response(200, {'status': 'brightness up press'})
            return
        if self.path == '/brightness_down':
            self.simulate_keypress(145)
            self.send_json_response(200, {'status': 'brightness down press'})
            return
        else:
            self.send_json_response(404, {'error': 'Not Found'})


if __name__ == '__main__':
    server_address = ('', 5001)  # Listen on all interfaces, port 5001
    httpd = http.server.HTTPServer(server_address, DiscoveryHandler)
    print('Starting discovery service on port 5001...')
    httpd.serve_forever()
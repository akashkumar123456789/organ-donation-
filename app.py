#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.parse
from router import Router
from database.connection import Database

class OrganDonationServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.router = Router()
        self.db = Database()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.serve_static_file()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        return

    def handle_api_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ''
            
            response = self.router.route(self.command, self.path, body)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            print(f"API Error: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def serve_static_file(self):
        if self.path == '/':
            self.path = '/frontend/pages/index.html'
        elif not self.path.startswith('/frontend/'):
            self.path = '/frontend' + self.path
        
        try:
            super().do_GET()
        except Exception as e:
            print(f"Static file error: {e}")
            self.path = '/frontend/pages/404.html'
            try:
                super().do_GET()
            except:
                self.send_error(404)

if __name__ == "__main__":
    PORT = 8000
    
    try:
        with socketserver.TCPServer(("", PORT), OrganDonationServer) as httpd:
            httpd.allow_reuse_address = True
            print(f"✓ Server running at http://localhost:{PORT}")
            print("✓ Press Ctrl+C to stop")
            httpd.serve_forever()
    except OSError as e:
        print(f"✗ Port {PORT} is already in use")
        print("✗ Stop existing server or use different port")
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
import http from 'http';
import url from "url";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class Server1 {
    constructor() {
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    start() {
        this.server.listen(8888);
    }

    async handleRequest(req, resp){
        // parse request
        let params = url.parse(req.url, true);
        
        if (params.pathname === '/') {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const filePath = path.join(__dirname, './index.html');
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(500, {'Content-Type': 'text/plain'});
                    resp.write('Internal Server Error');
                    resp.end();
                    return;
                }
                resp.writeHead(200, {'Content-Type': 'text/html'});
                resp.write(data);
                resp.end();
            });
        }

    }
}

const server1 = new Server1();
server1.start();
import http from 'http';
import url from "url";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import STRINGS from './lang/messages/en/strings.js';
import dotenv from 'dotenv';
dotenv.config();

class Server1 {
    // initialize server and allowed origins for CORS
    constructor() {
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    // start front end server on specified port
    start() {
        this.server.listen(process.env.SERVER1_PORT);
        console.log(`Server1 running on port ${process.env.SERVER1_PORT}`);
    }

    // handle incoming requests to server1 (index.html, client.js, style.css)
    async handleRequest(req, resp){
        // parse request
        let params = url.parse(req.url, true);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // serve index.html file
        if (params.pathname === '/') {
            const filePath = path.join(__dirname, './index.html');
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(500, {'Content-Type': 'text/plain'});
                    resp.write(STRINGS.SERVER_ERROR);
                    resp.end();
                    return;
                }
                resp.writeHead(200, {'Content-Type': 'text/html'});
                resp.write(data);
                resp.end();
            });
        }

        // serve client.js file
        else if (params.pathname === '/client.js') {
            const filePath = path.join(__dirname, './client.js');
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(404, {'Content-Type': 'text/plain'});
                    resp.write(STRINGS.NOT_FOUND);
                    resp.end();
                    return;
                }
                resp.writeHead(200, {'Content-Type': 'application/javascript'});
                resp.write(data);
                resp.end();
            });
        }

        // serve style.css file
        else if (params.pathname === '/styles/style.css') {
            const filePath = path.join(__dirname, './styles/style.css');

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(404, {'Content-Type': 'text/plain'});
                    return resp.end(STRINGS.NOT_FOUND);
                }

                resp.writeHead(200, {'Content-Type': 'text/css'});
                resp.end(data);
            });
        }

        // serve strings.js file
        else if (params.pathname === '/lang/messages/en/strings.js') {
            const filePath = path.join(__dirname, './lang/messages/en/strings.js');

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(404, {'Content-Type': 'text/plain'});
                    return resp.end(STRINGS.NOT_FOUND);
                }

                resp.writeHead(200, {'Content-Type': 'application/javascript'});
                resp.end(data);
            });
        }

    }
}

const server1 = new Server1();
server1.start();
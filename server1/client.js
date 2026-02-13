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
        console.log('Server1 running on port 8888');
    }

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
                    resp.write('Internal Server Error');
                    resp.end();
                    return;
                }
                resp.writeHead(200, {'Content-Type': 'text/html'});
                resp.write(data);
                resp.end();
            });
        }

        // serve browser-client.js file
        else if (params.pathname === '/browser-client.js') {
            const filePath = path.join(__dirname, './browser-client.js');
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    resp.writeHead(404, {'Content-Type': 'text/plain'});
                    resp.write('Not Found');
                    resp.end();
                    return;
                }
                resp.writeHead(200, {'Content-Type': 'application/javascript'});
                resp.write(data);
                resp.end();
            });
        }
    }

    // // send POST request to server2 to insert patients
    // insertPatients() {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open("POST", "https://four537lab4-vg9m.onrender.com/api/v1/insert", true);
    //     xhr.onload = function(response) {
    //         if (xhr.status === 200) {
    //             console.log(response.target.responseText);
    //         } else {
    //             console.error("Failed to insert patients");
    //         }
    //     };
    //     xhr.send();
    // }
}

const server1 = new Server1();
server1.start();
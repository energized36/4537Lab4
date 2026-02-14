import http from 'http';
import url from 'url';
import { insertPatients, runSelectQuery } from "./db.js";

class Server2 {
    // initialize server and allowed origins for CORS
    constructor() {    
        this.server2 = http.createServer(this.handleRequest.bind(this));
        this.allowedOrigins = [
            'http://localhost:8888',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'https://four537lab4-server1.onrender.com/'
        ];
    }

    // start backend server on specified port
    start() {
        this.server2.listen(process.env.SERVER2_PORT);
        console.log(`Server2 running on PORT ${process.env.SERVER2_PORT}`);
    }

    // add CORS headers to allow cross-origin requests from Server1
    setCORSHeaders(req, resp) {
        const origin = req.headers.origin;
        
        // allow requests from allowed origins, default to localhost:8888 if origin not in list
        if (this.allowedOrigins.includes(origin)) {
            resp.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            // default to localhost:8888 if origin not in list
            resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
        }
        
        resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        resp.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    // handle incoming requests
    async handleRequest(req, resp) {
        this.setCORSHeaders(req, resp);

        // handle preflight OPTIONS request
        if (req.method === 'OPTIONS') {
            resp.writeHead(200, {'Content-Type': 'text/plain'});
            resp.end();
            return;
        }

        // handle GET req
        if (req.method == "GET" && req.url.startsWith("/api/v1/sql")) {
            const sql = url.parse(req.url, true).query;
            resp.writeHead(200, {'Content-Type': 'application/json'});
            resp.write(JSON.stringify(await runSelectQuery(sql.queryStatement)));
            resp.end();
            return;
        }

        // handle POST req
        else if (req.method == "POST" && req.url === "/api/v1/insert") {
            await insertPatients();
            resp.writeHead(200, {'Content-Type': 'text/plain'});
            resp.write("inserted patients");
            resp.end();
            return;
        }
        
        // handle unknown routes
        resp.writeHead(500, {'Content-Type': 'text/plain'});
        resp.write('Internal Server Error');
        resp.end();
    }
}

let server2 = new Server2();
server2.start();
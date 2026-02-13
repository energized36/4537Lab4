import http from 'http';
import url from 'url';
import { insertPatients, runSelectQuery } from "./db.js";

class Server2 {
    constructor() {    
        this.server2 = http.createServer(this.handleRequest.bind(this));
    }

    start() {
        this.server2.listen(process.env.PORT);
        console.log(`Server2 running on PORT ${process.env.PORT}`);
    }

    // add CORS headers to allow cross-origin requests from Server1
    setCORSHeaders(req, resp) {
        resp.setHeader('Access-Control-Allow-Origin', '*');
        resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        resp.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    async handleRequest(req, resp) {
        this.setCORSHeaders(req, resp);

        if (req.method === 'OPTIONS') {
            resp.writeHead(204);
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
        
        resp.writeHead(500, {'Content-Type': 'text/plain'});
        resp.write('Internal Server Error');
        resp.end();
    }
}

let server2 = new Server2();
server2.start();
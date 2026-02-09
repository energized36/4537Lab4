import http from 'http';
import url from 'url';
import { insertPatients, runSelectQuery } from "./db.js";

class Server2 {
    constructor() {    
        this.server2 = http.createServer(this.handleRequest.bind(this));
        // assign db to object
    }

    start() {
        this.server2.listen(9999);
    }

    async handleRequest(req, resp) {
        // Handle GET req
        if (req.method == "GET" && req.url.startsWith("/api/v1/sql")) {
            const sql = url.parse(req.url, true).query;
            resp.writeHead(200, {'Content-Type': 'application/json'});
            resp.write(JSON.stringify(await runSelectQuery(sql.queryStatement)));
            resp.end();
            return;
        }

        // Handle POST req
        else if (req.method == "POST" && req.url === "/api/v1/insert") {
            // Insert patients
            await insertPatients();
            resp.writeHead(200, {'Content-Type': 'text/plain'});
            resp.write("inserted patients");
            resp.end();
            return;
        }
        
        // Error
        resp.writeHead(500, {'Content-Type': 'text/plain'});
        resp.write('Internal Server Error');
        resp.end();
    }
}

let server2 = new Server2();
server2.start();
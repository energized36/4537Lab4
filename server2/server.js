import http from "http";
import url from "url";
import { insertPatients, runSelectQuery } from "./db.js";
import STRINGS2 from "./lang/messages/en/strings2.js";

class Server2 {
  // initialize server and allowed origins for CORS
  constructor() {
    this.server2 = http.createServer(this.handleRequest.bind(this));
    this.allowedOrigins = [
      "http://localhost:8888",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://four537lab4-server1.onrender.com",
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
    console.log("Incoming Origin:", req.headers.origin);

    // allow requests from allowed origins
    if (this.allowedOrigins.includes(origin)) {
      resp.setHeader("Access-Control-Allow-Origin", origin);
    }
    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  // handle incoming requests
  async handleRequest(req, resp) {
    this.setCORSHeaders(req, resp);

    // handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      resp.writeHead(200, { "Content-Type": "text/plain" });
      return resp.end();
    }

    // handle GET req
    if (req.method === "GET" && req.url.startsWith("/api/v1/sql")) {
      try {
        const sql = url.parse(req.url, true).query;
        const result = await runSelectQuery(sql.queryStatement);
        resp.writeHead(200, { "Content-Type": "application/json" });
        return resp.end(JSON.stringify(result));
      } catch (error) {
        resp.writeHead(400, { "Content-Type": "application/json" });
        return resp.end(
          JSON.stringify({
            error: error.sqlMessage || error.message,
          }),
        );
      }
    }

    // handle POST req
    else if (req.method == "POST" && req.url === "/api/v1/insert") {
      try {
        await insertPatients();

        resp.writeHead(200, { "Content-Type": "text/plain" });
        return resp.end(STRINGS2.INSERT_SUCCESS);
      } catch (error) {
        resp.writeHead(400, { "Content-Type": "application/json" });
        return resp.end(
          JSON.stringify({
            error: error.sqlMessage || STRINGS2.INSERT_FAILURE,
          }),
        );
      }
    }

    // handle unknown routes
    resp.writeHead(500, { "Content-Type": "text/plain" });
    resp.write(STRINGS2.SERVER_ERROR);
    return resp.end();
  }
}

let server2 = new Server2();
server2.start();

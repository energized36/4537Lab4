# 4537 Lab 4  
## Patient Database – Two-Server Architecture

This lab demonstrates executing SQL queries using a two-server architecture:

- **Server 1 (Frontend Server)** – Serves a static web page.
- **Server 2 (Backend API Server)** – Provides a RESTful API for interacting with the database.

---

## 📁 Project Structure
```
server1/
├── index.html
├── client.js
├── styles/
└── server.js

server2/
├── server.js
├── db.js
```
---

## 🖥️ Server Overview

### 🔹 Server 1 – Frontend
- Serves the static HTML page.
- Allows users to:
  - Insert predefined patients.
  - Submit SQL `SELECT` queries (read-only).
- Communicates with **Server 2** via HTTP requests.

---

### 🔹 Server 2 – Backend API
- RESTful API server.
- Handles:
  - Database insert operations.
  - Database query operations.
- `server.js` → Handles routing and request processing.
- `db.js` → Contains SQL statements and database interaction logic.

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

Run the following in the project root:

```bash
npm install

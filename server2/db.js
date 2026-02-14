import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

// Create connection to sql db for writing 
const writerPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_WRITER_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Creare connection to sql db for reading
const readerPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_READER_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Ensure patient table exists before inserting patients
async function ensureTableExists() {
  await writerPool.query(`
    CREATE TABLE IF NOT EXISTS patient (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      dateOfBirth INT
    ) ENGINE=InnoDB
  `);
}

// Insert patients into db
export async function insertPatients() {
  await ensureTableExists();
  await writerPool.query(`
    INSERT INTO patient (name, dateOfBirth) VALUES
    ('Sara Brown', 19010101),
    ('John Smith', 19410101),
    ('Jack Ma', 19610130),
    ('Elon Musk', 19990101)
  `);
}

// Run SELECT query and return results
export async function runSelectQuery(sql) {
  const [rows] = await readerPool.query(sql);
  return rows;
}

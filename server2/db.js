import mysql from "mysql2/promise";

// Create connection to sql db for writing 
export const writerPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "lab4_writer",
  password: "strongpassword",
  database: "railway"
});

// Creare connection to sql db for reading
export const readerPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "lab4_reader",
  password: "strongpassword",
  database: "railway"
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

export async function runSelectQuery(sql) {
  const [rows] = await readerPool.query(sql);
  return rows;
}

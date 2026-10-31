// Explicit opt-in for a new, empty deployment database.
import 'dotenv/config';
import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
if (process.env.INIT_EMPTY_DB === 'true') {
  const connection = await mysql.createConnection({
    host:process.env.DB_HOST, port:Number(process.env.DB_PORT||3306), user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,database:process.env.DB_NAME
  });
  try {
    const [tables] = await connection.query('SHOW TABLES');
    if (tables.length === 0) {
      const sql = await readFile(new URL('./database-baru.sql',import.meta.url),'utf8');
      for (const stmt of sql.replace(/^\s*--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean)) await connection.query(stmt);
    }
    await connection.query('SELECT checkout_key FROM pesanan_obat LIMIT 0');
    console.log('Database BidanKu siap.');
  } finally { await connection.end(); }
}
